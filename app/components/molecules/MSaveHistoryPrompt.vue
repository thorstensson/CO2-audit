<script setup lang="ts">
  import { ref, watch } from 'vue'

  // Persists across component remounts within the same session
  let dismissed = false

  // Nuxt Supabase core hooks
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Connect to our global scan state engine
  const { showSavePrompt, lastScanData } = useScanState()

  const isSaving = ref(false)
  const saveSuccess = ref(false)

  // Auto-dismiss after 15s, never show again
  watch(showSavePrompt, (val) => {
    if (val) {
      if (dismissed) {
        showSavePrompt.value = false
        return
      }
      dismissed = true
      setTimeout(() => {
        showSavePrompt.value = false
      }, 15000)
    }
  })
  async function handleSaveAction() {
    if (!lastScanData.value) return

    // 1. Guard check: Intercept logged-out guests silently without alert banners
    if (!user.value) {
      // Cache the unsaved data into localStorage so it survives the page redirect
      localStorage.setItem(
        'pending_scan_history',
        JSON.stringify(lastScanData.value)
      )
      return navigateTo('/login')
    }

    // 2. Verified route: Logged-in user inserts directly into Supabase
    isSaving.value = true
    try {
      const payload = {
        url: lastScanData.value.url,
        co2_grams: lastScanData.value.co2Grams,
        // ========================================================================
        // STABLE PRODUCTION FIX: Stringify actual server breakdown data safely
        // Eliminates the editor squiggle and stops database column truncation
        // ========================================================================
        breakdown_bytes: JSON.stringify(lastScanData.value.breakdown || {}),
        user_id: user.value.id,
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
  <div
    v-if="showSavePrompt"
    class="border-secondary/10 bg-secondary/5 fixed right-8 bottom-8 z-50 flex max-w-md min-w-[340px] flex-col gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:flex-row sm:items-center print:hidden"
  >
    <div class="grid grid-cols-1 text-center sm:text-left">
      <div
        :class="saveSuccess ? 'visible' : 'invisible'"
        class="col-start-1 row-start-1"
      >
        <p class="text-acc2 text-sm font-semibold">Metrics synchronized!</p>
        <p class="text-acc2 mt-0.5 text-xs">
          Successfully saved to your dashboard analytics history.
        </p>
      </div>

      <div
        :class="saveSuccess ? 'invisible' : 'visible'"
        class="col-start-1 row-start-1"
      >
        <p class="text-acc2 text-base font-semibold">
          Want to save this CO₂ score?
        </p>
        <p class="text-acc2 mt-0.5 text-sm">
          {{
            user
              ? 'Add this result to your account profile.'
              : 'Create a free account to track your carbon history.'
          }}
        </p>
      </div>
    </div>

    <div
      :class="{ invisible: saveSuccess }"
      class="min-w-[130px] self-center sm:self-auto"
    >
      <AButton
        variant="green"
        :label="isSaving ? 'Saving...' : user ? 'Save Data' : 'Register'"
        :disabled="isSaving"
        class="shrink-0 whitespace-nowrap"
        @click="handleSaveAction"
      />
    </div>
  </div>
</template>
