<script setup lang="ts">
  import { computed, ref } from 'vue'
  import TreeIcon from '@iconify-vue/glyphs-poly/tree'
  import CarSideIcon from '@iconify-vue/glyphs-poly/car-side'
  import AnalyticsIcon from '@iconify-vue/glyphs-poly/analytics'

  const handlePrint = () => window.print()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const viewMode = ref<'perView' | 'annual'>('perView')
  const annualViews = ref(10000)
  const multiplier = computed(() =>
    viewMode.value === 'annual' ? annualViews.value : 1
  )

  const handleDelete = async () => {
    console.log('DELETE', scan.value.url, user.value?.sub)
    if (!scan.value?.url || !user.value?.sub) return

    try {
      const { error } = await supabase
        .from('site_logs')
        .delete()
        .eq('user_id', user.value.sub) // Changed to sub
        .eq('url', scan.value.url)
        .eq('co2_grams', scan.value.co2Grams)

      if (error) throw error

      // Remove from local state instantly
      const idx = selectedIndex.value
      scanHistory.value = scanHistory.value.filter((_, i) => i !== idx)

      // If no scans left, reset to empty state
      if (scanHistory.value.length === 0) {
        lastScanData.value = null
      }

      // Adjust index if we deleted the last item
      if (selectedIndex.value >= scanHistory.value.length) {
        selectedIndex.value = scanHistory.value.length - 1
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Oops! Could not delete that scan. Please try again.')
    }
  }

  // Fetch your global scan state array handlers natively
  const {
    selectedScan,
    isScanning,
    scanHistory,
    selectedIndex,
    lastScanData,
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
        style: 'text-gray-500 bg-gray-100 border-primary-100',
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
    <!-- Toolbar: navigation left, actions right -->
    <div
      v-if="showDashboard"
      class="bg-primary border-primary-200 mb-6 flex flex-col items-center justify-between gap-2 rounded-2xl border px-4 py-2 shadow-sm sm:flex-row print:hidden"
    >
      <!-- Navigation group -->
      <div v-if="scanHistory.length > 1" class="flex items-center gap-3">
        <button
          :disabled="selectedIndex <= 0"
          class="font-heading text-secondary hover:text-secondary/80 cursor-pointer text-sm font-medium tracking-widest transition disabled:opacity-50"
          @click="goToPrev"
        >
          <span class="inline-flex items-center gap-1"
            ><Icon name="fa6-solid:angles-left" size="14" />Prev</span
          >
        </button>
        <span class="text-secondary/60 font-mono text-sm"
          >{{ selectedIndex + 1 }} / {{ scanHistory.length }}</span
        >
        <button
          :disabled="selectedIndex >= scanHistory.length - 1"
          class="font-heading text-secondary hover:text-secondary/80 cursor-pointer text-sm font-medium tracking-widest transition disabled:opacity-30"
          @click="goToNext"
        >
          <span class="inline-flex items-center gap-1"
            >Next<Icon name="fa6-solid:angles-right" size="14"
          /></span>
        </button>
      </div>

      <!-- Spacer when nav is hidden but toolbar is shown -->
      <div v-if="scanHistory.length <= 1" class="hidden sm:block"></div>

      <div class="flex items-center gap-2">
        <AButton
          v-if="user"
          variant="outline"
          class="text-xs"
          @click="handleDelete"
        >
          <Icon name="fa6-solid:trash" /> Delete
        </AButton>
        <AButton
          variant="outline"
          class="text-xs"
          title="Save paper."
          @click="handlePrint"
        >
          <Icon name="fa6-solid:print" /> Print as PDF
        </AButton>
      </div>
    </div>

    <!-- State view if there are no loaded runs -->
    <div
      v-if="!scan && !isScanning"
      class="bg-primary border-primary-100 rounded-2xl border-2 border-dashed py-16 text-center"
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
      class="bg-primary border-primary-100 rounded-2xl border py-20 text-center shadow-sm"
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
        class="bg-primary border-primary-100 overflow-hidden rounded-2xl border shadow-sm lg:col-span-2"
      >
        <div
          class="border-primary-100 flex items-center justify-between border-b px-6 py-5"
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

        <div class="divide-primary-100 divide-y">
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
          class="bg-primary border-primary-100 flex flex-col justify-between rounded-2xl border p-6 shadow-sm"
        >
          <div>
            <h4 class="text-acc2 text-h3 font-bold">Sustainability Index</h4>
            <div
              class="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div
                class="font-heading flex size-16 items-center justify-center self-start rounded-xl border text-center text-4xl leading-none font-black sm:self-auto"
                :class="ratingScale?.style"
              >
                {{ ratingScale?.grade }}
              </div>
              <div>
                <p class="text-base font-bold">{{ ratingScale?.label }}</p>
                <p class="text-base">
                  Produces
                  <span class="font-semibold"
                    >{{ (scan?.co2Grams * multiplier).toFixed(4) }}g</span
                  >
                  CO₂ {{ viewMode === 'annual' ? 'per year' : 'per view' }}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-World Equivalents -->
        <div class="text-primary mt-4 space-y-3 text-sm">
          <!-- Fossil Car Travel Distance -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <Icon name="glyphs-poly:car-side" size="48" />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? (scan.co2Grams * multiplier) / 0.12 >= 1000
                      ? ((scan.co2Grams * multiplier) / 120).toFixed(2) + ' km'
                      : ((scan.co2Grams * multiplier) / 0.12).toFixed(1) + ' m'
                    : '0.0 m'
                }}
              </p>
              <p>Distance driven in a fossil-fueled car equivalent.</p>
            </div>
          </div>

          <!-- Tree Absorption Duration -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <Icon name="glyphs-poly:tree" size="48" />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? (scan.co2Grams * multiplier) / 0.04185 >= 60
                      ? ((scan.co2Grams * multiplier) / 2.511).toFixed(1) +
                        ' hours'
                      : ((scan.co2Grams * multiplier) / 0.04185).toFixed(1) +
                        ' mins'
                    : '0.0 mins'
                }}
              </p>
              <p>Time for a mature tree to absorb this amount.</p>
            </div>
          </div>

          <!-- LED Bulb Equivalent -->
          <div class="flex items-center gap-3 rounded-xl bg-green-50 p-2">
            <Icon name="glyphs-poly:lightbulb-2" size="48" class="shrink-0" />
            <div>
              <p class="font-mono font-semibold">
                {{
                  scan?.co2Grams
                    ? (scan.co2Grams * multiplier) / 4 >= 1
                      ? ((scan.co2Grams * multiplier) / 4).toFixed(1) + ' hours'
                      : ((scan.co2Grams * multiplier) / 0.0667).toFixed(1) +
                        ' mins'
                    : '0 mins'
                }}
              </p>
              <p>10W LED bulb powered for this duration.</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              class="font-heading border-primary-100 flex rounded-lg border p-0.5"
            >
              <button
                class="rounded-md px-3 py-1 text-xs font-medium transition"
                :class="
                  viewMode === 'perView'
                    ? 'bg-acc1 text-primary'
                    : 'text-secondary/60 hover:text-secondary'
                "
                @click="viewMode = 'perView'"
              >
                Per View
              </button>
              <button
                class="rounded-md px-3 py-1 text-xs font-medium transition"
                :class="
                  viewMode === 'annual'
                    ? 'bg-acc1 text-primary'
                    : 'text-secondary/60 hover:text-secondary'
                "
                @click="viewMode = 'annual'"
              >
                Annual
              </button>
            </div>
            <input
              v-if="viewMode === 'annual'"
              v-model.number="annualViews"
              type="number"
              min="1"
              class="w-20 border-0 bg-transparent px-1 py-1 text-xs outline-none"
              placeholder="Views"
            />
            <span
              v-if="viewMode === 'annual'"
              class="text-secondary text-xs whitespace-nowrap"
            >
              Based on {{ annualViews.toLocaleString() }} page views / year
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-5 hidden text-center text-sm text-gray-500 print:block print:break-inside-avoid"
    >
      Made by Thomas | www.thomasthorstensson.com
    </div>

    <!-- @standalone-print (removed — moved to toolbar above) -->
  </div>
</template>
