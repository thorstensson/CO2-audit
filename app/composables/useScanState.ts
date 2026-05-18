import { computed } from 'vue'
import { useState } from '#app'

// 1. Define explicit TypeScript interfaces for strict type safety
interface BreakdownBytes {
  html: number
  css: number
  javascript: number
  images: number
  fonts: number
  other: number
}

interface ScanDataPayload {
  url: string
  co2Grams: number
  breakdownBytes: BreakdownBytes // <-- Added tracking mapping schema
  lighthouseFakeRun: number
}

interface SavedScanState {
  url: string
  co2Grams: number
  breakdownBytes: BreakdownBytes // <-- Added to the state persistence definition
}

// 2. FIXED: True outside instantiation guarantees a single shared global memory state registry pool
const targetUrlShared = () => useState<string>('scan_target_url', () => '')
const isScanningShared = () =>
  useState<boolean>('scan_is_scanning', () => false)
const turnstileTokenShared = () =>
  useState<string>('scan_turnstile_token', () => '')
const showSavePromptShared = () =>
  useState<boolean>('show_save_prompt', () => false)

// Update the type signature here to allow the new breakdown object structure
const lastScanDataShared = () =>
  useState<SavedScanState | null>('last_scan_data', () => null)

const scanHistoryShared = () =>
  useState<SavedScanState[]>('scan_history', () => [])
const selectedIndexShared = () => useState<number>('selected_index', () => 0)

const co2TrackedShared = () =>
  useState<string | number>('co2_tracked', () => '—')
const lighthouseRunsShared = () =>
  useState<string | number>('lighthouse_runs', () => '—')
const co2SavedShared = () => useState<string | number>('co2_saved', () => '—')

export const useScanState = () => {
  // Bind directly to the single shared memory instances
  const targetUrl = targetUrlShared()
  const isScanning = isScanningShared()
  const turnstileToken = turnstileTokenShared()
  const showSavePrompt = showSavePromptShared()
  const lastScanData = lastScanDataShared()

  const scanHistory = scanHistoryShared()
  const selectedIndex = selectedIndexShared()

  const co2Tracked = co2TrackedShared()
  const lighthouseRuns = lighthouseRunsShared()
  const co2Saved = co2SavedShared()

  // The currently selected scan from history
  const selectedScan = computed(() => {
    if (scanHistory.value.length > 0) {
      return scanHistory.value[selectedIndex.value] ?? null
    }
    return lastScanData.value
  })

  function goToPrev() {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  function goToNext() {
    if (selectedIndex.value < scanHistory.value.length - 1) {
      selectedIndex.value++
    }
  }

  async function runGuestScan() {
    if (!targetUrl.value || !turnstileToken.value) return
    isScanning.value = true
    showSavePrompt.value = false

    try {
      const data = await $fetch<ScanDataPayload>('/api/scan', {
        method: 'POST',
        body: {
          url: targetUrl.value,
          token: turnstileToken.value,
        },
      })

      co2Tracked.value = `${data.co2Grams}g`
      lighthouseRuns.value = data.lighthouseFakeRun

      const { calculateSaved } = useBaseline()
      co2Saved.value = calculateSaved(data.co2Grams)

      const scan: SavedScanState = {
        url: data.url,
        co2Grams: data.co2Grams,
        breakdownBytes: data.breakdownBytes,
      }

      lastScanData.value = scan
      scanHistory.value = [scan, ...scanHistory.value]
      selectedIndex.value = 0
      showSavePrompt.value = true
    } catch (error) {
      console.error('Scan execution encountered an error:', error)
    } finally {
      isScanning.value = false
    }
  }

  return {
    targetUrl,
    isScanning,
    turnstileToken,
    co2Tracked,
    lighthouseRuns,
    co2Saved,
    runGuestScan,
    showSavePrompt,
    lastScanData,
    scanHistory,
    selectedIndex,
    selectedScan,
    goToPrev,
    goToNext,
  }
}
