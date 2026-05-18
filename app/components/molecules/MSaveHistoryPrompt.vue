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
        breakdown_bytes: lastScanData.value.breakdownBytes,
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
  <!-- Fixed toast prompt that appears after a scan completes -->
  <div
    v-if="showSavePrompt"
    class="fixed right-8 bottom-8 z-50 flex max-w-md min-w-[340px] flex-col gap-3 rounded-xl border bg-white p-4 shadow-lg transition-all duration-300 sm:flex-row sm:items-center"
    :class="
      saveSuccess
        ? 'border-blue-200 bg-blue-50'
        : 'border-green-200 bg-green-50'
    "
  >
    <div class="grid grid-cols-1 text-center sm:text-left">
      <!-- Both states share the same grid cell; the taller one determines height -->
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

    <div :class="{ invisible: saveSuccess }" class="min-w-[130px]">
      <AButton
        variant="green"
        :label="
          isSaving ? 'Saving...' : user ? 'Save Data' : 'Log in to Save History'
        "
        :disabled="isSaving"
        class="shrink-0 whitespace-nowrap"
        @click="handleSaveAction"
      />
    </div>
  </div>
</template>
