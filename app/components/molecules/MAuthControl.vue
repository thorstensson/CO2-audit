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
  navigateTo('/')
}
</script>

<template>
  <!-- Desktop Layout Architecture Variant -->
  <div v-if="mode === 'desktop'" class="flex items-center gap-4 border-l border-gray-200 pl-8">
    <template v-if="user">
      <span class="text-xs font-mono font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded max-w-[150px] truncate">
        {{ user.email }}
      </span>
      <button
        @click="handleLogout"
        class="font-heading text-xs font-bold tracking-widest text-rose-600 hover:text-rose-400 transition-colors duration-300"
      >
        LOGOUT
      </button>
    </template>
    <template v-else>
      <NuxtLink
        to="/login"
        class="font-heading text-sm font-semibold tracking-widest text-green-600 hover:text-green-700 transition-colors duration-300"
      >
        LOGIN
      </NuxtLink>
    </template>
  </div>

  <!-- Mobile Slide-In Overlay Layout Architecture Variant -->
  <div v-else class="border-t border-gray-100 pt-8 flex flex-col gap-6 items-end">
    <template v-if="user">
      <span class="text-xs font-mono font-semibold text-gray-400 max-w-[220px] truncate">
        Signed in as {{ user.email }}
      </span>
      <button
        @click="handleLogout"
        class="font-heading text-2xl font-semibold tracking-widest text-rose-600 hover:text-rose-400 transition-colors duration-300"
      >
        LOGOUT
      </button>
    </template>
    <template v-else>
      <NuxtLink
        to="/login"
        class="font-heading text-2xl font-semibold tracking-widest text-green-600 hover:text-green-700 transition-colors duration-300"
      >
        LOGIN
      </NuxtLink>
    </template>
  </div>
</template>
