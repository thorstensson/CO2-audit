<script setup lang="ts">
  import { ref } from 'vue'
  import Logo from '@/assets/svg/logo.svg'

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
  <footer
    class="bg-primary-400 text-secondary-100 mt-20 p-12 text-xs print:hidden"
  >
    <!-- Changed from grid to flex with justify-between -->
    <div
      class="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:justify-between"
    >
      <!-- COLUMN 1: About & Cookie Disclosure -->
      <!-- Added md:max-w-[300px] to keep paragraphs looking nice -->
      <div
        class="flex flex-col items-start gap-2 text-left md:max-w-[300px] md:text-sm"
      >
        <Logo class="mb-4 h-8 w-auto" />
        <a
          class="hover:text-secondary underline underline-offset-2 transition-colors"
          href="mailto:hello@co2audit.com"
          >hello@co2audit.com</a
        >
        <p class="mt-1 leading-relaxed">
          This site uses only necessary cookies.<br class="md:hidden" />
          No tracking or analytics!
        </p>
        <a
          href="https://www.thomasthorstensson.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-secondary text-acc1 transition"
        >
          Made by Thomas Thorstensson
        </a>
      </div>

      <!-- COLUMN 2: Learning Resources -->
      <div class="flex flex-col gap-2 text-left text-xs md:text-sm">
        <h3 class="font-heading text-lg">Learning</h3>
        <a
          href="https://thegreenwebfoundation.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Green Web Foundation (opens in new tab)"
          class="hover:text-secondary underline underline-offset-2 transition-colors"
          >thegreenwebfoundation.org</a
        >
        <a
          href="https://greensoftware.foundation"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Green Software Foundation (opens in new tab)"
          class="hover:text-secondary underline underline-offset-2 transition-colors"
          >Software Carbon Intensity (SCI)</a
        >
        <a
          href="https://sustainablewebdesign.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sustainable Web Design (opens in new tab)"
          class="hover:text-secondary underline underline-offset-2 transition-colors"
          >sustainablewebdesign.org</a
        >
        <a
          href="https://w3.org/TR/web-sustainability-guidelines"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="W3C Web Sustainability Guidelines (opens in new tab)"
          class="hover:text-secondary underline underline-offset-2 transition-colors"
          >W3C Web Sustainability Guidelines</a
        >
      </div>

      <!-- COLUMN 3: Status / Contact -->
      <div class="flex flex-col gap-2 text-left text-xs">
        <h3 class="font-heading text-lg">Stack</h3>
        <div class="flex items-center">
          <span>Nuxt 4 / Puppeteer</span>
        </div>
        <p>
          Data stored in
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Supabase (opens in new tab)"
            class="hover:text-secondary underline underline-offset-2 transition-colors"
            >Supabase</a
          >
        </p>
        <p>Hosted on Vercel.</p>
        <p>MVP.</p>
      </div>
    </div>
  </footer>
</template>
