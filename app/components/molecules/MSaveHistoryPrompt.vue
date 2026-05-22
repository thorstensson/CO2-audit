<script setup lang="ts">
  import { ref, watch, onUnmounted } from 'vue'

  // Nuxt Supabase core hooks
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Connect to our global scan state engine
  const { showSavePrompt, lastScanData } = useScanState()

  const isSaving = ref(false)
  const saveSuccess = ref(false)
  const errorMessage = ref<string | null>(null) // Internal variable for diagnostic debugging

  // Keep track of active timers to protect template visibility toggles
  let autoDismissTimer: ReturnType<typeof setTimeout> | null = null
  let successTimer: ReturnType<typeof setTimeout> | null = null

  // Auto-dismiss after 15s with proper timer overwrite protection
  watch(showSavePrompt, (val) => {
    if (autoDismissTimer) clearTimeout(autoDismissTimer)

    if (val) {
      errorMessage.value = null // Clean out previous errors when a new prompt triggers
      autoDismissTimer = setTimeout(() => {
        showSavePrompt.value = false
      }, 15000)
    }
  })

  // Avoid visual glitches/leaks if the user closes or changes pages quickly
  onUnmounted(() => {
    if (autoDismissTimer) clearTimeout(autoDismissTimer)
    if (successTimer) clearTimeout(successTimer)
  })

  async function handleSaveAction() {
    if (!lastScanData.value) return
    errorMessage.value = null

    // 1. RLS FIX: Direct check on client session token to ensure Bearer headers exist before write
    if (!user.value) {
      const {
        data: { session },
      } = await client.auth.getSession()
      if (session?.user) {
        user.value = session.user as any
      }
    }

    // 2. Guard check: Intercept logged-out guests silently without alert banners
    if (!user.value) {
      // Cache the unsaved data into localStorage so it survives the pfage redirect
      localStorage.setItem(
        'pending_scan_history',
        JSON.stringify(lastScanData.value)
      )
      return navigateTo('/login')
    }

    // 3. Verified route: Logged-in user inserts directly into Supabase
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
      if (successTimer) clearTimeout(successTimer)
      successTimer = setTimeout(() => {
        showSavePrompt.value = false
        saveSuccess.value = false
      }, 3000)
    } catch (err: any) {
      // Retained in console log, mapped to our new internal debugging track
      console.error('Database write error:', err.message || err)
      errorMessage.value = err.message || 'Database write rejected.'
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <div
    v-if="showSavePrompt"
    class="border-secondary/10 bg-primary/20 fixed bottom-8 left-1/2 z-50 flex max-w-md min-w-[340px] -translate-x-1/2 flex-col gap-3 rounded-xl border p-2 shadow-lg backdrop-blur-md transition-all duration-300 sm:right-8 sm:left-auto sm:translate-x-0 sm:flex-row sm:items-center print:hidden"
  >
    <div class="grid grid-cols-1 text-center sm:text-left">
      <div
        :class="saveSuccess ? 'visible' : 'invisible'"
        class="col-start-1 row-start-1"
      >
        <p class="text-secondary text-sm font-semibold">
          Metrics synchronized!
        </p>
        <p class="text-secondary mt-0.5 text-xs">
          Successfully saved to your dashboard analytics history.
        </p>
      </div>

      <div
        :class="saveSuccess ? 'invisible' : 'visible'"
        class="col-start-1 row-start-1"
      >
        <p class="text-secondary text-base font-semibold">
          Want to save this CO₂ score?
        </p>
        <p class="text-secondary mt-0.5 text-sm">
          {{
            user
              ? 'Add this result to your account profile.'
              : 'Create a free account to track your carbon history.'
          }}
        </p>

        <!-- [OPTIONAL DIAGNOSTIC] Renders only if RLS rejects your token, completely hidden otherwise -->
        <p
          v-if="errorMessage"
          class="mt-1 max-w-[280px] font-mono text-[10px] leading-tight text-rose-500"
        >
          Error: {{ errorMessage }}
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
