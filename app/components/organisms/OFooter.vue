<script setup lang="ts">
  import { ref } from 'vue'
  import HeartbeatIcon from '@iconify-vue/glyphs-poly/heartbeat'

  const client = useSupabaseClient()
  const scanCount = ref(0)

  async function fetchScanCount(userId: string) {
    const { count, error } = await client
      .from('site_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('[OFooter] Count query error:', error)
    }

    scanCount.value = count ?? 0
  }

  // Listen for auth state changes and verify with getUser() for security
  client.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      const {
        data: { user },
      } = await client.auth.getUser()
      if (user?.id) {
        fetchScanCount(user.id)
      }
    } else if (event === 'SIGNED_OUT') {
      scanCount.value = 0
    }
  })
</script>

<template>
  <footer class="bg-acc3 text-primary mt-20 p-8 text-xs print:hidden">
    <!-- Changed from grid to flex with justify-between -->
    <div
      class="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:justify-between"
    >
      <!-- COLUMN 1: About & Cookie Disclosure -->
      <!-- Added md:max-w-[300px] to keep paragraphs looking nice -->
      <div class="flex flex-col gap-2 text-left text-xs md:max-w-[300px]">
        <h3 class="font-heading text-sm font-semibold">CO₂ Audit</h3>
        <p>© 2026 Thomas James Thorstensson</p>
        <a
          href="https://www.thomasthorstensson.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >www.thomasthorstensson.com</a
        >
        <a
          href="https://buymeacoffee.com/thorstensson"
          target="_blank"
          rel="noopener noreferrer"
          title="Support a nice indie dev!"
          aria-label="Buy me a coffee (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >Buy me a coffee</a
        >
        <p class="mt-1 leading-relaxed">
          This site uses only strictly necessary cookies to keep you logged in.
          No tracking or analytics are used.
        </p>
      </div>

      <!-- COLUMN 2: Learning Resources -->
      <div class="flex flex-col gap-2 text-left text-xs">
        <h3 class="font-heading text-sm font-semibold">Learning Resources</h3>
        <a
          href="https://thegreenwebfoundation.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Green Web Foundation (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >thegreenwebfoundation.org</a
        >
        <a
          href="https://greensoftware.foundation"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Green Software Foundation (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >Software Carbon Intensity (SCI)</a
        >
        <a
          href="https://sustainablewebdesign.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sustainable Web Design (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >sustainablewebdesign.org</a
        >
        <a
          href="https://w3.org/TR/web-sustainability-guidelines"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="W3C Web Sustainability Guidelines (opens in new tab)"
          class="hover:text-primary/60 underline underline-offset-2 transition-colors"
          >W3C Web Sustainability Guidelines</a
        >
      </div>

      <!-- COLUMN 3: Status / Contact -->
      <div class="flex flex-col gap-2 text-left text-xs">
        <h3 class="font-heading text-sm font-semibold">Mode</h3>
        <div class="flex items-center">
          <HeartbeatIcon height="2.4em" />
          <span>All systems OK</span>
        </div>
        <p>Powered by Nuxt 4 + Puppeteer</p>
        <p>
          Data stored in
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Supabase (opens in new tab)"
            class="hover:text-primary/60 underline underline-offset-2 transition-colors"
            >Supabase</a
          >
        </p>
        <p v-if="scanCount > 0" class="text-primary">
          {{ scanCount }} {{ scanCount === 1 ? 'site' : 'sites' }} in database
        </p>
        <p class="text-primary">V1. More features to come.</p>
      </div>
    </div>
  </footer>
</template>
