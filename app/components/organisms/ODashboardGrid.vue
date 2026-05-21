<script setup lang="ts">
  import { computed } from 'vue'
  import TreeIcon from '@iconify-vue/glyphs-poly/tree'
  import CarSideIcon from '@iconify-vue/glyphs-poly/car-side'
  import AnalyticsIcon from '@iconify-vue/glyphs-poly/analytics'

  const handlePrint = () => window.print()

  // Fetch your global scan state array handlers natively
  const {
    selectedScan,
    isScanning,
    scanHistory,
    selectedIndex,
    goToPrev,
    goToNext,
  } = useScanState()

  /**
   * Safe computed proxy pointer.
   * Forces the component to evaluate the modern API payload shape dynamically
   * without choking on stale global interface definitions.
   */
  const scan = computed(() => selectedScan.value as any)

  /**
   * REACTIVE HYDRATION GATE
   * Replaces the manual onMounted ref approach. Returns false during the Vercel pre-render
   * phase (SSR) to keep server HTML lightweight, then automatically switches on the client
   * once reactive data models successfully hydrate.
   */
  const showDashboard = computed(() => {
    if (import.meta.env.SSR) return false
    return !!(scan.value && scan.value.co2Grams !== undefined)
  })

  /**
   * Computes asset footprint breakdown using live Puppeteer node data.
   * Maps pre-formatted backend text metrics directly to the layout presentation segments.
   * Uses defensive fallbacks to prevent runtime DOM tracking breakage if breakdown is null.
   */
  const footprintBreakdown = computed(() => {
    if (!scan.value) return null

    // Fallback block prevents type errors if server fails to send the breakdown object
    const breakdown = scan.value.breakdown || {
      html: { share: '0%', size: '0 KB' },
      css: { share: '0%', size: '0 KB' },
      javascript: { share: '0%', size: '0 KB' },
      images: { share: '0%', size: '0 KB' },
      fonts: { share: '0%', size: '0 KB' },
      other: { share: '0%', size: '0 KB' },
    }

    return [
      {
        name: 'HTML',
        weight: breakdown.html?.share || '0%',
        amount: breakdown.html?.size || '0 KB',
        color: 'bg-emerald-500/60',
      },
      {
        name: 'CSS',
        weight: breakdown.css?.share || '0%',
        amount: breakdown.css?.size || '0 KB',
        color: 'bg-teal-500/60',
      },
      {
        name: 'JavaScript',
        weight: breakdown.javascript?.share || '0%',
        amount: breakdown.javascript?.size || '0 KB',
        color: 'bg-cyan-500/60',
      },
      {
        name: 'Images',
        weight: breakdown.images?.share || '0%',
        amount: breakdown.images?.size || '0 KB',
        color: 'bg-violet-500/60',
      },
      {
        name: 'Fonts',
        weight: breakdown.fonts?.share || '0%',
        amount: breakdown.fonts?.size || '0 KB',
        color: 'bg-amber-500/60',
      },
      {
        name: 'Other',
        weight: breakdown.other?.share || '0%',
        amount: breakdown.other?.size || '0 KB',
        color: 'bg-rose-500/60',
      },
    ]
  })

  /**
   * Compares the scanned website carbon emissions against typical web standards.
   * Maps the backend sustainabilityIndex directly to matching UI text variants and Tailwind styles.
   */
  const ratingScale = computed(() => {
    // Graceful fallback card styling if the grade property is absent
    if (!scan.value || !scan.value.sustainabilityIndex) {
      return {
        grade: '—',
        label: 'No Rating Available',
        style: 'text-gray-500 bg-gray-100 border-gray-200',
      }
    }
    const grade = scan.value.sustainabilityIndex

    if (grade === 'A+') {
      return {
        grade: 'A+',
        label: 'Eco-Friendly / Extremely Light',
        style: 'text-emerald-600 bg-emerald-100 border-emerald-300',
      }
    }
    if (grade === 'A') {
      return {
        grade: 'A',
        label: 'Excellent',
        style: 'text-emerald-500 bg-emerald-100 border-emerald-200',
      }
    }
    if (grade === 'B') {
      return {
        grade: 'B',
        label: 'Good / Well Optimized',
        style: 'text-green-600 bg-green-100 border-green-200',
      }
    }
    if (grade === 'C') {
      return {
        grade: 'C',
        label: 'Moderate Impact',
        style: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      }
    }
    if (grade === 'D') {
      return {
        grade: 'D',
        label: 'High Impact',
        style: 'text-orange-600 bg-orange-100 border-orange-200',
      }
    }

    // Default Fallback to F
    return {
      grade: 'F',
      label: 'Heavy Carbon Load',
      style: 'text-rose-600 bg-rose-100 border-rose-200',
    }
  })
</script>

<template>
  <div class="mx-auto max-w-screen-2xl px-6 py-12">
    <!-- Pagination controls -->
    <div
      v-if="scanHistory.length > 1"
      class="mb-6 flex items-center justify-center gap-4 print:hidden"
    >
      <button
        :disabled="selectedIndex <= 0"
        class="font-heading text-secondary/60 hover:text-secondary text-h3 cursor-pointer font-semibold tracking-widest transition disabled:opacity-30"
        @click="goToPrev"
      >
        ← Prev
      </button>
      <span class="text-secondary/40 text-h3 font-mono"
        >{{ selectedIndex + 1 }} / {{ scanHistory.length }}</span
      >
      <button
        :disabled="selectedIndex >= scanHistory.length - 1"
        class="font-heading text-secondary/60 hover:text-secondary text-h3 cursor-pointer font-semibold tracking-widest transition disabled:opacity-30"
        @click="goToNext"
      >
        Next →
      </button>
    </div>

    <!-- State view if there are no loaded runs -->
    <div
      v-if="!scan && !isScanning"
      class="bg-primary rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-xl font-bold text-gray-400"
      >
        <Icon name="glyphs-poly:analytics" size="48" />
      </div>
      <h3 class="text-acc3 mt-4 text-sm font-semibold">
        No scan analytics loaded
      </h3>
      <p class="text-secondary mx-auto mt-1 max-w-xs text-sm">
        Enter a website address above to break down asset sizes and calculate
        its carbon score.
      </p>
    </div>

    <!-- Active Loading Template State -->
    <div
      v-else-if="isScanning"
      class="bg-primary rounded-2xl border border-gray-100 py-20 text-center shadow-sm"
    >
      <div
        class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"
      ></div>
      <p class="mt-4 text-sm text-gray-500">
        Compiling real-time payload metrics...
      </p>
    </div>

    <!-- Visual Dashboard (Gated safely by the single showDashboard computed condition) -->
    <div
      v-else-if="showDashboard"
      class="grid grid-cols-1 gap-8 lg:grid-cols-3 print:break-before-page"
    >
      <div
        class="bg-primary overflow-hidden rounded-2xl border border-gray-100 shadow-sm lg:col-span-2"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
        >
          <div>
            <h3 class="text-h3 text-acc2 font-bold">Carbon Asset Breakdown</h3>
            <p class="text-base">
              Distribution of wire transfer weights for
              <span class="rounded bg-green-50 px-1 font-mono text-green-700">{{
                scan?.url
              }}</span>
            </p>
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="item in footprintBreakdown"
            :key="item.name"
            class="flex flex-col justify-between gap-2 px-6 py-4 transition sm:flex-row sm:items-center"
          >
            <div class="flex items-center gap-3">
              <span
                class="h-2 w-2 shrink-0 rounded-full"
                :class="item.color"
              ></span>
              <span class="text-base font-medium">{{ item.name }}</span>
            </div>
            <div
              class="flex w-full items-center justify-between gap-4 pl-5 sm:w-auto sm:justify-end sm:pl-0"
            >
              <span class="font-mono text-base">{{ item.weight }}</span>
              <span class="font-mono text-base font-semibold">{{
                item.amount
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Grade/Rating Segment -->
        <div
          class="bg-primary flex flex-col justify-between rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div>
            <h4 class="text-acc2 text-h3 font-bold">Sustainability Index</h4>
            <div
              class="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div
                class="font-heading self-start rounded-xl border px-4 py-2 text-4xl font-black sm:self-auto"
                :class="ratingScale?.style"
              >
                {{ ratingScale?.grade }}
              </div>
              <div>
                <p class="text-base font-bold">{{ ratingScale?.label }}</p>
                <p class="text-base">
                  Produces
                  <span class="font-semibold">{{ scan?.co2Grams }}g</span> CO₂
                  per view.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-World Equivalents -->
        <div class="text-primary mt-4 space-y-3 text-sm">
          <!-- Fossil Car Travel Distance -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <CarSideIcon height="4em" />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? scan.co2Grams / 0.12 >= 1000
                      ? (scan.co2Grams / 120).toFixed(2) + ' km'
                      : (scan.co2Grams / 0.12).toFixed(1) + ' m'
                    : '0.0 m'
                }}
              </p>
              <p>Distance driven in a fossil-fueled car equivalent.</p>
            </div>
          </div>

          <!-- Tree Absorption Duration -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <TreeIcon height="4em" />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? scan.co2Grams / 0.04185 >= 60
                      ? (scan.co2Grams / 2.511).toFixed(1) + ' hours'
                      : (scan.co2Grams / 0.04185).toFixed(1) + ' mins'
                    : '0.0 mins'
                }}
              </p>
              <p>Time for a mature tree to absorb this amount.</p>
            </div>
          </div>

          <!-- Coffee Footprint Equivalent -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <Icon
              name="streamline-plump-color:coffee-mug-flat"
              size="48"
              class="shrink-0"
            />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? scan.co2Grams >= 250
                      ? (scan.co2Grams / 250).toFixed(1) + ' cups'
                      : ((scan.co2Grams / 250) * 100).toFixed(1) + '% of a cup'
                    : '0.0%'
                }}
              </p>
              <p>Equal to the footprint of brewing this much coffee.</p>
            </div>
          </div>
          <p class="text-secondary/60 text-xs italic">
            No inflated or multiplied values. Based on one time measurement.
          </p>
        </div>
      </div>
    </div>

    <div v-if="showDashboard" class="mt-8 flex justify-center print:hidden">
      <AButton variant="outline" label="Print as PDF" @click="handlePrint" />
    </div>
  </div>
</template>
