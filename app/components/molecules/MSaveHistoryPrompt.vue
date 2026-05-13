<script setup lang="ts">
import { ref } from 'vue'

// Nuxt Supabase core hooks
const client = useSupabaseClient()
const user = useSupabaseUser()

// Connect to our global scan state engine
const { showSavePrompt, lastScanData } = useScanState()

const isSaving = ref(false)
const saveSuccess = ref(false)

async function handleSaveAction() {
  if (!lastScanData.value) return

  // 1. Guard check: Intercept logged-out guests silently without alert banners
  if (!user.value) {
    // Cache the unsaved data into localStorage so it survives the page redirect
    localStorage.setItem('pending_scan_history', JSON.stringify(lastScanData.value))
    return navigateTo('/login')
  }

  // 2. Verified route: Logged-in user inserts directly into Supabase
  isSaving.value = true
  try {
    const payload = {
      url: lastScanData.value.url,
      co2_grams: lastScanData.value.co2Grams,
      user_id: user.value.id
    } as any

    const { error } = await client.from('site_logs').insert(payload)
    if (error) throw error

    // Set interactive visual success state feedback loops
    saveSuccess.value = true
    localStorage.removeItem('pending_scan_history') // Clear cache on database success

    // Smoothly auto-close the prompt card after showing success
    setTimeout(() => {
      showSavePrompt.value = false
      saveSuccess.value = false
    }, 3000)

  } catch (err: any) {
    console.error('Database write error:', err.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <!-- Renders dynamically beneath your metrics layout once a scan succeeds -->
  <div
    v-if="showSavePrompt"
    class="max-w-2xl mx-auto mt-8 p-4 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300"
    :class="saveSuccess ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'"
  >
    <div class="text-center sm:text-left">
      <template v-if="saveSuccess">
        <p class="text-sm font-semibold text-blue-900">
          ✨ Metrics synchronized!
        </p>
        <p class="text-xs text-blue-700 mt-0.5">
          Successfully saved to your dashboard analytics history.
        </p>
      </template>
      <template v-else>
        <p class="text-sm font-semibold text-green-900">
          Want to save this measurement score?
        </p>
        <p class="text-xs text-green-700 mt-0.5">
          {{ user ? 'Add this result directly into your account profile.' : 'Create a free account to track your carbon analytics history.' }}
        </p>
      </template>
    </div>

    <button
      v-if="!saveSuccess"
      @click="handleSaveAction"
      :disabled="isSaving"
      class="w-full sm:w-auto px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg shadow-sm transition disabled:bg-gray-400"
    >
      {{ isSaving ? 'Saving...' : (user ? 'Save to My Profile' : 'Log in to Save History') }}
    </button>
  </div>
</template>
