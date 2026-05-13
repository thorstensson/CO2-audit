<script setup lang="ts">
import { useScanState } from '@/composables/useScanState'
// Pulling the state directly from the composable you already built
const { targetUrl, isScanning, turnstileToken, runGuestScan } = useScanState()
</script>

<template>
  <div class="w-full max-w-2xl mx-auto flex flex-col gap-4">
    <!-- Combined input and button layout to replace the confusing buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="targetUrl"
        type="url"
        placeholder="Type website URL (e.g., https://my-site.com)"
        :disabled="isScanning"
        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
    <div class="flex justify-start">
      <NuxtTurnstile
        v-model="turnstileToken"
        :options="{ theme: 'light' }"
      />
    </div>
  </div>
</template>
