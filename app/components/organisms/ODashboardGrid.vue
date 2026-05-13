<script setup lang="ts">
import { computed } from 'vue'

// FIXED: Reference the state engine directly without destructuring to maintain global reactivity links
const scanState = useScanState()

const lastScanData = computed(() => scanState.lastScanData.value)
const isScanning = computed(() => scanState.isScanning.value)

console.log('[ODashboardGrid] mounted — lastScanData:', lastScanData.value)

// Calculate mock segments from the raw CO2 byte footprint for data grid visualization
const footprintBreakdown = computed(() => {
  if (!lastScanData.value) return null

  const total = lastScanData.value.co2Grams
  return [
    { name: 'DOM & Script Execution', weight: '45%', amount: `${(total * 0.45).toFixed(3)}g`, color: 'bg-emerald-500' },
    { name: 'Images & Media Assets', weight: '35%', amount: `${(total * 0.35).toFixed(3)}g`, color: 'bg-teal-500' },
    { name: 'Stylesheets & Fonts', weight: '15%', amount: `${(total * 0.15).toFixed(3)}g`, color: 'bg-cyan-500' },
    { name: 'Third-Party Tracking Pixels', weight: '5%', amount: `${(total * 0.05).toFixed(3)}g`, color: 'bg-amber-500' }
  ]
})

// Compare the scanned website against typical web standards
const ratingScale = computed(() => {
  if (!lastScanData.value) return null
  const score = lastScanData.value.co2Grams
  if (score < 0.2) return { grade: 'A+', label: 'Eco-Friendly', style: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  if (score < 0.5) return { grade: 'B', label: 'Moderate Impact', style: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
  return { grade: 'F', label: 'Heavy Carbon Load', style: 'text-rose-600 bg-rose-50 border-rose-200' }
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-6 py-12">
    <!-- Empty State View -->
    <div
      v-if="!lastScanData && !isScanning"
      class="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white"
    >
      <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto text-gray-400 font-bold text-xl">
        📊
      </div>
      <h3 class="mt-4 text-sm font-semibold text-gray-900">No scan analytics loaded</h3>
      <p class="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
        Input a target website link above to generate architectural weight details and carbon score segment tables.
      </p>
    </div>

    <!-- Processing State Loader -->
    <div v-else-if="isScanning" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-sm text-gray-500">Compiling real-time system payload metrics...</p>
    </div>

    <!-- Active Analytics Grid Workspace -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Column A: Detailed Structural Breakdown Table (Spans 2 columns) -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900">Carbon Asset Breakdown</h3>
            <p class="text-xs text-gray-500 mt-0.5">Estimated distribution of transfer weights for <span class="font-mono text-green-700 bg-green-50 px-1 rounded">{{ lastScanData?.url }}</span></p>
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="item in footprintBreakdown"
            :key="item.name"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full" :class="item.color"></span>
              <span class="text-sm font-medium text-gray-700">{{ item.name }}</span>
            </div>
            <div class="text-right flex items-center gap-4">
              <span class="text-xs text-gray-400 font-mono">{{ item.weight }}</span>
              <span class="text-sm font-semibold text-gray-900 font-mono">{{ item.amount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Column B: Environmental Impact Card Context -->
      <div class="space-y-6">
        <!-- Grade/Rating Segment -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">Sustainability Index</h4>
            <div class="mt-4 flex items-center gap-4">
              <div class="text-4xl font-black px-4 py-2 rounded-xl border font-heading" :class="ratingScale?.style">
                {{ ratingScale?.grade }}
              </div>
              <div>
                <p class="text-base font-bold text-gray-900">{{ ratingScale?.label }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Based on CO₂ grams generated per view instance.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Practical Equivalents Gauge -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">Real-World Equivalents</h4>
          <p class="text-xs text-gray-500 mt-1">If this targeted page hits 10,000 monthly views, it equals:</p>

          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-lg">🚗</span>
              <div>
                <p class="text-xs font-semibold text-gray-900 font-mono">
                  {{ ((lastScanData ? lastScanData.co2Grams * 10000 : 0) / 120).toFixed(1) }} km
                </p>
                <p class="text-[10px] text-gray-400">Driven in a standard combustion engine vehicle</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-lg">🌲</span>
              <div>
                <p class="text-xs font-semibold text-gray-900 font-mono">
                  {{ ((lastScanData ? lastScanData.co2Grams * 10000 : 0) / 2200).toFixed(2) }} weeks
                </p>
                <p class="text-[10px] text-gray-400">Full carbon absorption time needed for 1 mature tree</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
