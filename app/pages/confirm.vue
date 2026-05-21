<!-- app/pages/confirm.vue -->
<script setup lang="ts">
  const route = useRoute()

  onMounted(() => {
    const code = route.query.code as string

    if (!code) {
      return navigateTo('/login')
    }

    // Force route directly to our explicit server-side cookie endpoint
    return navigateTo(`/api/auth/confirm?code=${code}`, { external: true })
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="animate-pulse text-sm text-gray-500">
      Finalizing your secure session...
    </p>
  </div>
</template>
