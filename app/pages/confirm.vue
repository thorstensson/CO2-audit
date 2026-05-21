<!-- app/pages/confirm.vue -->
<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  // 1. Remove the watch block entirely to stop accidental premature redirects

  onMounted(async () => {
    const code = route.query.code as string

    if (!code) {
      return navigateTo('/login')
    }

    try {
      // 2. Explicitly WAIT for the network request and cookie minting to complete
      await supabase.auth.exchangeCodeForSession(code)

      // 3. Only redirect AFTER the line above completely finishes executing
      return navigateTo('/', { external: true })
    } catch (error) {
      console.error('Magic link verification failed:', error)
      return navigateTo('/login')
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
