<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const code = route.query.code as string

    if (!code) {
      return navigateTo('/login')
    }

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        throw error
      }

      // Wait one tick so auth state propagates
      await nextTick()

      return navigateTo('/')
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
