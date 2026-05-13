<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const user = useSupabaseUser()
const client = useSupabaseClient()
const { co2Tracked, lighthouseRuns, co2Saved, lastScanData } = useScanState()

// Explicitly declare an active listener token reference variable
let authListener: any = null

async function fetchUserHistory(userId: string) {
  try {
    const { data: logs, error } = await client
      .from('site_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (logs && logs.length > 0) {
      const totalGrams = logs.reduce((sum, log) => sum + (log.co2_grams || 0), 0)

      co2Tracked.value = `${totalGrams.toFixed(2)}g`
      lighthouseRuns.value = logs.length
      co2Saved.value = '0g'

      const latestLog = logs[0]
      if (latestLog) {
        lastScanData.value = {
          url: latestLog.url,
          co2Grams: latestLog.co2_grams
        }
        console.log('[index] fetchUserHistory successfully updated state:', lastScanData.value)
      }
    }
  } catch (err) {
    console.error('Failed to load user profile history:', err)
  }
}

console.log('[index] Initialization frame — lastScanData:', lastScanData.value)

onMounted(async () => {
  // 1. DIRECT DATABASE LISTENER: Replaces the broken watch block completely
  const { data } = client.auth.onAuthStateChange((event, session) => {
    console.log(`[index] Supabase Auth Event Triggered: ${event}`)

    if (session?.user?.id) {
      console.log("[index] Auth Stream caught initialized user session ID:", session.user.id)
      fetchUserHistory(session.user.id)
    }
  })
  authListener = data.subscription

  // 2. FALLBACK GUEST ROUTE: Processes pending guest scans
  const savedSession = localStorage.getItem('pending_scan_history')
  if (!savedSession) return

  const parsedData = JSON.parse(savedSession)

  if (!user.value?.id) {
    co2Tracked.value = `${parsedData.co2Grams}g`
    lighthouseRuns.value = 1
    co2Saved.value = '0g'
    lastScanData.value = parsedData
  } else {
    try {
      const payload = {
        url: parsedData.url,
        co2_grams: parsedData.co2Grams,
        user_id: user.value.id
      }

      const { error } = await client.from('site_logs').insert(payload as never)
      if (!error) {
        localStorage.removeItem('pending_scan_history')
        fetchUserHistory(user.value.id)
      }
    } catch (err) {
      console.error('Auto-save pending track failed:', err)
    }
  }
})

// Clean up background stream listeners when navigating away from the page structure
onUnmounted(() => {
  if (authListener) {
    authListener.unsubscribe()
  }
})
</script>

<template>
  <OHero />
  <OMetrics />
  <ODashboardGrid />
  <MSaveHistoryPrompt />
</template>
