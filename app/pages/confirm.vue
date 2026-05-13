<!-- app/pages/confirm.vue -->
<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()

// If the user lands here via a redirect link or OAuth provider
watch(user, (newUser) => {
  if (newUser) {
    // Session cookie has safely been minted; redirect safely to root
    return navigateTo('/')
  }
}, { immediate: true })

// Fallback handling if a code was missing or expired
onMounted(() => {
  if (!route.query.code) {
    return navigateTo('/login')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-sm text-gray-500 animate-pulse">
      Finalizing your secure session...
    </p>
  </div>
</template>
