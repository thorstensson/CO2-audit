<!-- app/pages/confirm.vue -->
<script setup lang="ts">
  const user = useSupabaseUser()
  const route = useRoute()
  const supabase = useSupabaseClient() // Added to run the code exchange

  // If the user lands here via a redirect link or OAuth provider
  watch(
    user,
    (newUser) => {
      if (newUser) {
        // Session cookie has safely been minted; redirect safely to root
        return navigateTo('/')
      }
    },
    { immediate: true }
  )

  // Fallback handling if a code was missing or expired
  onMounted(async () => {
    const code = route.query.code as string

    if (!code) {
      return navigateTo('/login')
    }

    try {
      // Trade the URL code from Gmail to mint the session cookie in this new window
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
