<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const token_hash = route.query.token_hash as string

    if (!token_hash) {
      return navigateTo('/login')
    }

    try {
      await supabase.auth.verifyOtp({ token_hash, type: 'magiclink' })
      return navigateTo('/', { external: true })
    } catch {
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
