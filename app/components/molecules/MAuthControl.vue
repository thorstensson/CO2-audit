<script setup lang="ts">
  // Core Supabase authentication state abstraction hooks
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // Layout modifier prop to cleanly adapt typography styling rules for mobile vs desktop viewports
  defineProps<{
    mode: 'desktop' | 'mobile'
  }>()

  async function handleLogout() {
    await supabase.auth.signOut()

    // Wait for auth state propagation
    await supabase.auth.getSession()

    // Hard refresh removes stale hydrated state
    window.location.href = '/'
  }
</script>

<template>
  <!-- Desktop Layout Architecture Variant -->
  <div
    v-if="mode === 'desktop'"
    class="flex items-center gap-4 border-l border-gray-200 pl-8"
  >
    <template v-if="user">
      <span
        class="text-primary max-w-[150px] truncate rounded bg-green-50 px-2 py-1 font-mono text-xs font-semibold"
      >
        {{ user.email }}
      </span>
      <button
        @click="handleLogout"
        class="font-heading text-acc3 text-xs font-bold transition-colors duration-300 hover:text-rose-400"
      >
        LOGOUT
      </button>
    </template>
    <template v-else>
      <NuxtLink
        to="/login"
        class="font-heading text-acc1 hover:text-acc1/80 text-sm font-semibold tracking-widest transition-colors duration-300"
      >
        LOGIN
      </NuxtLink>
    </template>
  </div>

  <!-- Mobile Slide-In Overlay Layout Architecture Variant -->
  <div
    v-else
    class="flex flex-col items-end gap-6 border-t border-gray-100 pt-8"
  >
    <template v-if="user">
      <span
        class="max-w-[220px] truncate font-mono text-xs font-semibold text-gray-400"
      >
        Signed in as {{ user.email }}
      </span>
      <button
        @click="handleLogout"
        class="font-heading text-2xl font-semibold tracking-widest text-rose-600 transition-colors duration-300 hover:text-rose-400"
      >
        LOGOUT
      </button>
    </template>
    <template v-else>
      <NuxtLink
        to="/login"
        class="font-heading text-2xl font-semibold tracking-widest text-green-600 transition-colors duration-300 hover:text-green-700"
      >
        LOGIN
      </NuxtLink>
    </template>
  </div>
</template>
