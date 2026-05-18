<script setup lang="ts">
  import { computed } from 'vue'
  import TreeIcon from '@iconify-vue/glyphs-poly/tree'
  import CarSideIcon from '@iconify-vue/glyphs-poly/car-side'
  import AnalyticsIcon from '@iconify-vue/glyphs-poly/analytics'

  // FIXED: Reference the state engine directly without destructuring to maintain global reactivity links
  const scanState = useScanState()

  // Scan data now holds a breakdown of bytes per type (image, script, styles, other)
  const selectedScan = computed(() => scanState.selectedScan.value)
  const isScanning = computed(() => scanState.isScanning.value)
  const scanHistory = computed(() => scanState.scanHistory.value)
  const selectedIndex = computed(() => scanState.selectedIndex.value)
  const { goToPrev, goToNext } = scanState

  /**
   * Computes asset footprint breakdown using live Puppeteer node data.
   * Scales the true tracked resource type sizes against the total page footprint.
   *
   * @see {@link https://thegreenwebfoundation.org} CO2.js Integration Guides
   * @returns {Array|null} The real calculated asset allocations for the data visualization.
   */
  const footprintBreakdown = computed(() => {
    if (!selectedScan.value || !selectedScan.value.breakdownBytes) return null

    const totalCo2 = selectedScan.value.co2Grams
    const bytes = selectedScan.value.breakdownBytes
    const totalBytes =
      bytes.html +
      bytes.css +
      bytes.javascript +
      bytes.images +
      bytes.fonts +
      bytes.other

    if (totalBytes === 0) return null

    // Helper mapping function to calculate individual metrics cleanly
    const createSegment = (name: string, assetBytes: number, color: string) => {
      const percentage = (assetBytes / totalBytes) * 100
      const assetCo2 = totalCo2 * (assetBytes / totalBytes)
      return {
        name,
        weight: `${percentage.toFixed(0)}%`,
        amount: `${assetCo2.toFixed(3)}g`,
        color,
      }
    }

    return [
      createSegment('HTML', bytes.html, 'bg-emerald-500/60'),
      createSegment('CSS', bytes.css, 'bg-teal-500/60'),
      createSegment('JavaScript', bytes.javascript, 'bg-cyan-500/60'),
      createSegment('Images', bytes.images, 'bg-violet-500/60'),
      createSegment('Fonts', bytes.fonts, 'bg-amber-500/60'),
      createSegment('Other', bytes.other, 'bg-rose-500/60'),
    ]
  })

  /**
   * Compares the scanned website carbon emissions against typical web standards.
   * Maps the co2Grams score directly to the open-source Digital Carbon Rating system.
   *
   * @see {@link https://sustainablewebdesign.org} Official SWD Grading System
   * @see {@link https://wholegraindigital.com} Rating Scale Announcement
   * @returns {Object|null} The grading scheme including letters, labels, and Tailwind styles.
   */
  const ratingScale = computed(() => {
    if (!selectedScan.value) return null
    const score = selectedScan.value.co2Grams

    // A+ represents the top 5% most efficient sites globally (< 0.2g CO2)
    if (score < 0.2)
      return {
        grade: 'A+',
        label: 'Eco-Friendly',
        style: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      }

    // B represents optimized, high-performing websites (< 0.5g CO2)
    if (score < 0.5)
      return {
        grade: 'B',
        label: 'Good',
        style: 'text-green-600 bg-green-50 border-green-200',
      }

    // C falls below the global average page weight median (< 1.0g CO2)
    if (score < 1.0)
      return {
        grade: 'C',
        label: 'Moderate Impact',
        style: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      }

    // D approaches the unoptimized average boundary (< 1.5g CO2)
    if (score < 1.5)
      return {
        grade: 'D',
        label: 'High Impact',
        style: 'text-orange-600 bg-orange-50 border-orange-200',
      }

    // E is the final tier cleaner than the global baseline median (< 2.0g CO2)
    if (score < 2.0)
      return {
        grade: 'E',
        label: 'Very High Impact',
        style: 'text-red-500 bg-red-50 border-red-200',
      }

    // F triggers automatically when the website exceeds global average emissions (>= 2.0g CO2)
    return {
      grade: 'F',
      label: 'Heavy Carbon Load',
      style: 'text-rose-600 bg-rose-50 border-rose-200',
    }
  })
</script>

<template>
  <div class="mx-auto max-w-screen-2xl px-6 py-12">
    <!-- Empty State View -->
    <div
      v-if="!selectedScan && !isScanning"
      class="bg-primary rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-xl font-bold text-gray-400"
      >
        <AnalyticsIcon height="1em" />
      </div>
      <h3 class="text-acc3 mt-4 text-sm font-semibold">
        No scan analytics loaded
      </h3>
      <p class="text-secondary mx-auto mt-1 max-w-xs text-sm">
        Enter a website address above to break down asset sizes and calculate
        its carbon score.
      </p>
    </div>

    <!-- Processing State Loader -->
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

    <!-- Active Analytics Grid Workspace -->
    <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Column A: Detailed Structural Breakdown Table (Spans 2 columns) -->
      <div
        class="bg-primary overflow-hidden rounded-2xl border border-gray-100 shadow-sm lg:col-span-2"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
        >
          <div>
            <h3 class="text-h3 text-acc2 font-bold">Carbon Asset Breakdown</h3>
            <p class="text-base">
              Estimated distribution of transfer weights for
              <span class="rounded bg-green-50 px-1 font-mono text-green-700">{{
                selectedScan?.url
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
              <span class="font-mono text-base font-semibold"
                >-{{ item.amount }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Column B: Environmental Impact Card Context -->
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
                  Based on CO₂ grams generated per viewing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Practical Equivalents Gauge -->
        <div
          class="bg-primary rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <h4 class="text-h3 text-acc2 font-bold">Real-World Equivalents</h4>
          <p class="mt-1 text-base">
            If this page hits 10,000 monthly views, it equals:
          </p>

          <div class="text-primary mt-4 space-y-3 text-sm">
            <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
              <CarSideIcon height="4em" />
              <div>
                <p class="font-mono font-semibold">
                  {{
                    (
                      (selectedScan ? selectedScan.co2Grams * 10000 : 0) / 120
                    ).toFixed(1)
                  }}
                  km
                </p>
                <p>Driven in a fossil-fueled car.</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
              <TreeIcon height="4em" />
              <div>
                <p class="font-mono font-semibold">
                  {{
                    (
                      (selectedScan ? selectedScan.co2Grams * 10000 : 0) / 2200
                    ).toFixed(2)
                  }}
                  weeks
                </p>
                <p>Time for a mature tree to absorb this amount.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div
      v-if="scanHistory.length > 1"
      class="p-y-20 mt-16 flex items-center justify-center gap-4"
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
  </div>
</template>
