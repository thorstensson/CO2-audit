<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const code = route.query.code
    if (!code || typeof code !== 'string') {
      navigateTo('/')
      return
    }

    // PKCE: exchange ?code=... for a session (sets Supabase SSR cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      // optional: console.error(error)
      navigateTo('/login')
      return
    }

    // remove the ?code from the URL
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
