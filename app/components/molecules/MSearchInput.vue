<script setup lang="ts">
  import { useScanState } from '@/composables/useScanState'

  const { targetUrl, isScanning, turnstileToken, runGuestScan } = useScanState()

  // Template ref so we can reset the widget after each scan
  const turnstile = ref<{ reset: () => void } | null>(null)

  // Watch for scan completion — when isScanning goes from true → false,
  // the token has been consumed by Cloudflare, so we need a fresh one.
  watch(isScanning, (scanning, wasScanning) => {
    if (wasScanning && !scanning) {
      turnstile.value?.reset()
    }
  })
</script>

<template>
  <div class="mx-auto mt-4 flex w-full max-w-2xl flex-col gap-4">
    <!-- Combined input and button layout to replace the confusing buttons -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <input
        v-model="targetUrl"
        type="url"
        placeholder="Type website URL (e.g., https://my-site.com)"
        :disabled="isScanning"
        class="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
      />

      <AButton
        variant="green"
        :label="isScanning ? 'Analyzing...' : 'Get Started'"
        :disabled="isScanning || !turnstileToken"
        @click="runGuestScan"
      />

      <AButton variant="outline" label="Learn More" to="/how" />
    </div>

    <!-- Official Nuxt Turnstile rendering node -->
    <div class="flex justify-center">
      <NuxtTurnstile
        ref="turnstile"
        v-model="turnstileToken"
        :options="{ theme: 'light', appearance: 'interaction-only' }"
      />
    </div>
  </div>
</template>
