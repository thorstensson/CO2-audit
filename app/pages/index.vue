<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from 'vue'

  const user = useSupabaseUser()
  const client = useSupabaseClient()
  const { co2Tracked, lighthouseRuns, co2Saved, lastScanData } = useScanState()

  // Explicitly declare an active listener token reference variable
  let authListener: any = null

  async function fetchUserHistory(userId: string) {
    console.log('fetchUserHistory', userId)
    try {
      const { data: logs, error } = await client
        .from('site_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (logs && logs.length > 0) {
        const { scanHistory, selectedIndex, selectedScan } = useScanState()

        // Map all logs into scan history
        scanHistory.value = logs.map((log: any) => ({
          url: log.url,
          co2Grams: log.co2_grams,
          sustainabilityIndex: '—',
          breakdown:
            typeof log.breakdown_bytes === 'string'
              ? JSON.parse(log.breakdown_bytes)
              : log.breakdown_bytes || {},
        }))

        console.log(
          'index, scanHistory',
          selectedIndex.value,
          scanHistory.value
        )

        // Show the latest scan (index 0)
        selectedIndex.value = 0
        const latestScan = selectedScan.value

        if (latestScan) {
          co2Tracked.value = `${latestScan.co2Grams}g`

          const { calculateSaved } = useBaseline()
          co2Saved.value = calculateSaved(latestScan.co2Grams)
        }

        lighthouseRuns.value = logs.length
      }
    } catch (err) {
      console.error('Failed to load user profile history:', err)
    }
  }

  onMounted(async () => {
    console.log('user check', user.value?.id)
    // 1. Immediately fetch history if already authenticated (covers post-redirect timing)
    if (user.value?.id) {
      fetchUserHistory(user.value.id)
    }

    // 2. Listen for future auth state changes
    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id) {
        fetchUserHistory(session.user.id)
      }
    })
    authListener = data.subscription

    // 3. Reactive fallback: catches late-resolving session (cookie→user timing)
    watch(user, (newUser) => {
      if (newUser?.id) {
        fetchUserHistory(newUser.id)
      }
    })

    // 2. FALLBACK GUEST ROUTE: Processes pending guest scans
    const savedSession = localStorage.getItem('pending_scan_history')
    if (!savedSession) return

    const parsedData = JSON.parse(savedSession)

    if (!user.value?.id) {
      co2Tracked.value = `${parsedData.co2Grams}g`
      lighthouseRuns.value = 1
      lastScanData.value = parsedData

      const { calculateSaved } = useBaseline()
      co2Saved.value = calculateSaved(parsedData.co2Grams)
    } else {
      ;('')
      try {
        const payload = {
          url: parsedData.url,
          co2_grams: parsedData.co2Grams,
          user_id: user.value.id,
        }

        const { error } = await client
          .from('site_logs')
          .insert(payload as never)
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
  <main>
    <OHero
      heading="Check any website's"
      highlight="carbon emissions."
      description="Analyze CO₂ output and performance of any website out there."
      :showSearch="true"
    />
    <OMetrics />
    <ODashboardGrid />
    <MSaveHistoryPrompt />
  </main>
</template>
