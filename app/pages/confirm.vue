<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const token_hash = route.query.token_hash as string
    const type = 'magiclink'

    console.log('---------THE TOKEN HASH', token_hash)
    if (!token_hash) {
      navigateTo('/login')
      return
    }

    try {
      // 1) Exchange token_hash for a session
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (error) throw error

      // 2) Force the client to load/update its session state
      await supabase.auth.getSession()

      // 3) Confirm user is available
      const { data, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      if (!data?.user) {
        navigateTo('/login')
        return
      }

      // 4) Navigate internally
      await navigateTo('/')
    } catch {
      navigateTo('/login')
    }
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="animate-pulse text-sm text-gray-500">
      Finalizing your secure session...
    </p>
  </div>
</template>
