<script setup lang="ts">
  import { nextTick, ref, onMounted } from 'vue'
  import { useScanState } from '@/composables/useScanState'

  // Keeping your exact composables completely unchanged
  const { targetUrl, isScanning, turnstileToken, runGuestScan } = useScanState()

  // Clean reference mapping to the native DOM element instance
  const altchaWidgetRef = ref<(HTMLElement & { reset: () => void }) | null>(
    null
  )

  // 1. Safely loads the ALTCHA script on the client side only
  onMounted(() => {
    import('altcha')
  })

  // 2. Triggers automatically when the custom web component resolves its math state
  const handleCaptchaState = (event: any) => {
    const { state, payload } = event.detail

    if (state === 'verified') {
      // Maps payload into your existing state setup smoothly
      turnstileToken.value = payload
    }
  }

  // Stable submit handler
  const handleSubmit = async () => {
    // extra safety (remains exactly as you wrote it)
    if (!turnstileToken.value || isScanning.value) {
      return
    }

    try {
      await runGuestScan()

      // Allow DOM lifecycle layout adjustments to finish
      await nextTick()
    } catch (err) {
      console.error('Scan failed:', err)
    }
  }
</script>

<template>
  <div class="mx-auto mt-4 flex w-full max-w-2xl flex-col gap-4 print:hidden">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-3 sm:flex-row">
        <input
          v-model="targetUrl"
          type="text"
          placeholder="Type website URL (e.g., https://my-site.com)"
          :disabled="isScanning"
          class="disabled:bg-acc2/30 disabled:text-secondary/80 border-primary-200 flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <AButton
          type="submit"
          variant="green"
          :label="isScanning ? 'Analyzing...' : 'Get Started'"
          :disabled="isScanning || !turnstileToken"
          class="w-full sm:w-auto"
        />
      </div>

      <div class="flex flex-col items-stretch gap-4 sm:items-center">
        <!-- 4. Corrected lowercase event binding case to map custom elements natively -->
        <ClientOnly class="self-center">
          <altcha-widget
            ref="altchaWidgetRef"
            challenge="/api/captcha/challenge"
            hidefooter
            :class="{ 'invisible h-0 overflow-hidden': turnstileToken }"
            @statechange="handleCaptchaState"
          ></altcha-widget>
        </ClientOnly>
      </div>
    </form>
  </div>
</template>
