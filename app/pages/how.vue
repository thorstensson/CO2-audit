<script setup lang="ts">
  useSeoMeta({
    title: 'How It Works',
    description:
      'Explore our technical creative stack. Learn how we utilize Nuxt 4, Supabase, and server-side Puppeteer to calculate real-time web carbon emissions.',
  })
</script>
<template>
  <main>
    <OHero heading="How it works" highlight="under the hood." description="" />

    <!-- Main wrapper provides broad horizontal padding -->
    <section class="mx-auto mt-16 max-w-5xl px-4 pb-24 md:px-6">
      <!-- ALL body content restricted here to the same tight, readable width -->
      <div class="mx-auto max-w-3xl">
        <!-- 1. Tech Stack Breakdowns -->
        <div
          class="text-body text-secondary mb-16 flex flex-col gap-4 leading-relaxed"
        >
          <h2 class="font-heading text-h1 text-acc2 text-center font-bold">
            The Creative Stack
          </h2>

          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">Nuxt 4</h2>
          <p>
            My favourite progressive meta-framework handles the reactive
            frontend and layout. Nuxt's Nitro server runs (<code
              class="rounded bg-green-50 px-1 font-mono text-sm text-green-700"
              >/server/api/</code
            >) the backend scripts. Content is sent to the browser in immediate
            chunks rather than waiting for the whole page to build on the server
            (I need a dictinonary for SSR).
          </p>

          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">
            Puppeteer
          </h2>
          <p>
            Puppeteer launches a headless Chromium instance on the server, loads
            the page like a real user, lets call him Bob, and captures the
            network response as it arrives. The code measures the actual byte
            sizes from those response buffers and chops them into HTML, CSS,
            JavaScript, images, fonts, and other assets.
          </p>

          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">
            Supabase
          </h2>
          <p>
            I store audit history and page metrics in a Supabase PostgreSQL
            database. This way, if you're logged in, you can check out your past
            website scans. (More functionality will ship to motivate this login
            feature.) Access is secured through Row Level Security (RLS), while
            heavier calculations are cached to avoid flushing the server with
            calls.
          </p>
        </div>

        <!-- 2. Carbon Calculation Pipeline -->
        <div
          class="text-body text-secondary mb-16 flex flex-col gap-4 leading-relaxed"
        >
          <h2 class="font-heading text-h1 text-acc2 text-center font-bold">
            The Carbon Calculation Pipeline
          </h2>

          <p>
            <span class="font-semibold">User Request:</span> The user enters a
            URL on the frontend.
          </p>
          <p>
            <span class="font-semibold">Puppeteer Spin-up:</span> Nuxt triggers
            a server-side headless browser.
          </p>
          <p>
            <span class="font-semibold">Data Harvesting:</span> Puppeteer tracks
            and logs asset network sizes.
          </p>
          <p>
            <span class="font-semibold">Carbon Translation:</span> Raw bytes are
            passed into the carbon logic formula.
          </p>
          <p>
            <span class="font-semibold">Database Sync:</span> Supabase records
            the audit for history and dashboard analytics.
          </p>
          <p>
            <span class="font-semibold">UI Render:</span> The frontend
            translates data into scannable percentage breakdowns.
          </p>
        </div>

        <!-- 3. Future Horizons / Coming Features (Now correctly wrapped inside max-w-3xl) -->
        <div
          class="text-body text-secondary mt-24 flex flex-col gap-4 border-t border-green-100 pt-16 leading-relaxed"
        >
          <h2 class="font-heading text-h1 text-acc2 text-center font-bold">
            What's Baking for V2
          </h2>
          <p class="text-secondary">
            Let's map out the next iteration to make these sustainability
            insights tangible!
          </p>
          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">
            Framework Detection
          </h2>
          <p>
            The auditor will sniff out if a site is running on Nuxt, Next.js,
            WordPress, or vanilla code. Instead of generic advice, you will get
            optimizations feedback for your <i>creative stack.</i>
          </p>

          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">
            SSR vs. SPA Analysis
          </h2>
          <p>
            By inspecting the page’s initial server response, we can tell
            whether a site is rendered on the server or assembled later in the
            browser with client-side JavaScript. That allows us to give
            recommendations tailored to how the site actually works, instead of
            relying on generic performance advice.
          </p>

          <h2 class="font-heading text-h2 text-acc2 mt-4 font-bold">
            Other stuff
          </h2>
          <p>Not telling, it's a secret.</p>
        </div>
      </div>
    </section>
  </main>
</template>
