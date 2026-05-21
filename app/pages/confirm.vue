<script setup lang="ts">
  const supabase = useSupabaseClient()

  onMounted(async () => {
    const { data } = await supabase.auth.getSession()

    if (data.session) {
      await navigateTo('/')
    } else {
      // fallback safety
      await navigateTo('/login')
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
