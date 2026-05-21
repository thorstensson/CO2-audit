<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function waitForSession(timeoutMs = 8000, intervalMs = 150) {
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

    console.log('root.query.code', code)

    if (!code || Array.isArray(code) || typeof code !== 'string') {
      navigateTo('/')
      return
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('error', error)
    if (error) {
      navigateTo('/login')
      return
    }

    // IMPORTANT: wait for session propagation on the client (timing fix)
    try {
      await waitForSession()
      console.log('await waitForSession()')
    } catch {
      // if it fails, fall back to login rather than racing/redirecting to a wrong state
      navigateTo('/login')
      console('log catch failed navigate to login')
      return
    }

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
