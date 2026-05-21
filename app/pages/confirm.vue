<script setup lang="ts">
  const route = useRoute()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const code = route.query.code

    if (!code || Array.isArray(code) || typeof code !== 'string') {
      navigateTo('/')
      return
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      navigateTo('/login')
      return
    }
    // ✅ Sync the client auth state *now* (no page refresh)
    await supabase.auth.getUser()
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
