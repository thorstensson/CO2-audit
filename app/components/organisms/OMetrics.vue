<script setup lang="ts">
  import { computed } from 'vue'
  import { useScanState } from '@/composables/useScanState'
  import { useBaseline } from '@/composables/useBaseline'

  const { selectedScan, isScanning } = useScanState()
  const { calculateSaved } = useBaseline()

  const displayCo2 = computed(() =>
    selectedScan.value ? `${selectedScan.value.co2Grams}g` : '—'
  )

  const displaySaved = computed(() =>
    selectedScan.value ? calculateSaved(selectedScan.value.co2Grams) : '—'
  )

  const savedClass = computed(() =>
    String(displaySaved.value).startsWith('-') ? 'text-rose-300' : 'text-acc2'
  )
</script>

<template>
  <section class="relative py-16">
    <div class="mx-auto max-w-screen-2xl px-6">
      <!-- Site heading — shown when a scan result is available -->
      <div
        :class="['mb-6 text-center', selectedScan ? 'visible' : 'invisible']"
      >
        <p class="font-heading text-h2 text-acc2 font-semibold">
          Carbon Report:
        </p>
        <p class="font-heading mt-1 inline-block max-w-full truncate text-sm">
          {{ selectedScan?.url }}
        </p>
      </div>

      <ALoadingDots v-if="isScanning" />

      <div
        v-else
        class="flex flex-col justify-center gap-x-64 gap-y-8 md:flex-row"
      >
        <AMetric :value="displayCo2" label="CO₂ tracked" />
        <AMetric
          :value="displaySaved"
          label="CO₂ saved"
          :valueClass="savedClass"
        />
      </div>
    </div>
  </section>
</template>
