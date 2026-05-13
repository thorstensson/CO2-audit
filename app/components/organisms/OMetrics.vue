<script setup lang="ts">
import { useScanState } from '@/composables/useScanState'

// 1. Pull the reactive states from your composable
const { co2Tracked, lighthouseRuns, co2Saved } = useScanState()
</script>

<template>
  <section class="py-20 bg-gray-50 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
    <div class="mx-auto max-w-screen-2xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 2. Use the :value syntax to pass the reactive state down -->
      <AMetric :value="co2Tracked" label="CO₂ tracked" />
      <AMetric :value="lighthouseRuns" label="Lighthouse runs" />
      <AMetric :value="co2Saved" label="CO₂ saved" />
    </div>
  </section>
</template>
