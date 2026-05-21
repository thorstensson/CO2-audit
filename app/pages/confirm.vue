<script setup lang="ts">
  const user = useSupabaseUser()

  watch(user, (newUser) => {
    if (newUser) {
      navigateTo('/')
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
