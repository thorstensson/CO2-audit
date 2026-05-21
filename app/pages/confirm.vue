<!-- app/pages/confirm.vue -->
<script setup lang="ts">
  const user = useSupabaseUser()
  const route = useRoute()
  const supabase = useSupabaseClient()

  watch(
    user,
    (newUser) => {
      if (newUser) {
        // Test: Forcing a standard window-level reload instead of an internal SPA push
        return navigateTo('/', { external: true })
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    const code = route.query.code as string

    if (!code) {
      return navigateTo('/login')
    }

    try {
      await supabase.auth.exchangeCodeForSession(code)
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
