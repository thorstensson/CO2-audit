<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function waitForSession(timeoutMs = 10000, intervalMs = 200) {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      const { data } = await supabase.auth.getSession()
      if (data.session) return data.session
      await sleep(intervalMs)
    }
    throw new Error('Timed out waiting for session on client')
  }

  onMounted(async () => {
    const code = route.query.code

    console.log('confirm query.code', code)

    if (!code || Array.isArray(code) || typeof code !== 'string') {
      navigateTo('/')
      return
    }

    // 1) Exchange code -> session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('exchange data present?', !!data)
    if (error) {
      console.log('exchange error', error)
      navigateTo('/login')
      return
    }

    // 2) Wait until client sees the session cookie/state
    try {
      const session = await waitForSession()
      console.log('session ready', !!session?.access_token)
    } catch (e) {
      console.log('waitForSession failed', e)
      navigateTo('/login')
      return
    }

    // 3) Navigate after session is confirmed in the client
    navigateTo('/', { replace: true })
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="animate-pulse text-sm text-gray-500">
      Finalizing your secure session...
    </p>
  </div>
</template>
