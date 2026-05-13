import { useState } from '#app'

// 1. FIXED: True outside instantiation guarantees a single shared global memory state registry pool
const targetUrlShared = () => useState<string>('scan_target_url', () => '')
const isScanningShared = () => useState<boolean>('scan_is_scanning', () => false)
const turnstileTokenShared = () => useState<string>('scan_turnstile_token', () => '')
const showSavePromptShared = () => useState<boolean>('show_save_prompt', () => false)
const lastScanDataShared = () => useState<{ url: string; co2Grams: number } | null>('last_scan_data', () => null)

const co2TrackedShared = () => useState<string | number>('co2_tracked', () => '—')
const lighthouseRunsShared = () => useState<string | number>('lighthouse_runs', () => '—')
const co2SavedShared = () => useState<string | number>('co2_saved', () => '—')

export const useScanState = () => {
  // Bind directly to the single shared memory instances
  const targetUrl = targetUrlShared()
  const isScanning = isScanningShared()
  const turnstileToken = turnstileTokenShared()
  const showSavePrompt = showSavePromptShared()
  const lastScanData = lastScanDataShared()

  const co2Tracked = co2TrackedShared()
  const lighthouseRuns = lighthouseRunsShared()
  const co2Saved = co2SavedShared()

  async function runGuestScan() {
    if (!targetUrl.value || !turnstileToken.value) return
    isScanning.value = true
    showSavePrompt.value = false

    try {
      const data = await $fetch<{ url: string; co2Grams: number; lighthouseFakeRun: number }>('/api/scan', {
        method: 'POST',
        body: {
          url: targetUrl.value,
          token: turnstileToken.value
        }
      })

      co2Tracked.value = `${data.co2Grams}g`
      lighthouseRuns.value = data.lighthouseFakeRun
      co2Saved.value = '0g'

      lastScanData.value = { url: data.url, co2Grams: data.co2Grams }
      showSavePrompt.value = true

    } catch (error) {
      console.error('Scan execution encountered an error:', error)
    } finally {
      isScanning.value = false
      turnstileToken.value = ''
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
    lastScanData
  }
}
