<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(() => {
    const code = route.query.code

    if (!code || Array.isArray(code) || typeof code !== 'string') {
      navigateTo('/')
      return
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setTimeout(() => navigateTo('/', { replace: true }), 1000)
      }
    })
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="animate-pulse text-sm text-gray-500">
      Finalizing your secure session...
    </p>
  </div>
</template>
