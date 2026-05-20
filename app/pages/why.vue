<script setup lang="ts">
  import GlobeEarthIcon from '@iconify-vue/glyphs-poly/globe-earth'
  import Tree4Icon from '@iconify-vue/glyphs-poly/tree-4'
  import Speedometer3Icon from '@iconify-vue/glyphs-poly/speedometer-3'
  useSeoMeta({
    title: 'Why Web Sustainability Matters',
    description:
      'Understand the environmental impact of digital bloat, why reducing page weight lowers carbon emissions, and how green sites improve performance.',
  })
</script>

<template>
  <main>
    <OHero heading="Why CO₂ matters" highlight="on the web." description="" />

    <!-- Main wrapper remains wide to let the pillaars spread out -->
    <section class="mx-auto mt-8 max-w-5xl pb-24">
      <!-- Text content restricted to a readable, tight reading width -->
      <div class="mx-auto max-w-3xl">
        <!-- 1. Environmental Impact -->
        <div
          class="text-body text-secondary mb-16 flex flex-col gap-4 leading-relaxed"
        >
          <h2 class="font-heading text-h2 text-acc2 text-center font-bold">
            The Environmental Impact
          </h2>
          <p>
            I built this app to learn more about CO₂ emissons on the web. I do
            not pretend to follow best practice, but we all have to start
            somewhere!
          </p>
          <p>
            The internet isn't invisible; it runs on coal-and-gas-powered data
            centers that stay turned on 24/7. As AI expands, more of these
            centers are spreading across the earth each day. Collectively, even
            seemingly small actions can make big differences to our climate
            challenges.
          </p>
          <p>
            The digital ecosystem is responsible for roughly 2.1% to 4% of
            global greenhouse gas emissions. That is equivalent to the entire
            global aviation industry!
          </p>
          <p>
            Every single megabyte downloaded emits CO₂. Albeit it’s not jet
            fuel, the outcome is similar: heavy, unoptimized websites with
            uncompressed images and bloated scripts quietly add to the
            internet’s growing climate footprint with every page view.
          </p>
          <p>
            Read more at
            <a
              href="https://sustainablewebmanifesto.com"
              target="_blank"
              class="text-acc2 hover:text-acc2/80 underline underline-offset-2"
              >The Sustainable Web Manifesto</a
            >
          </p>
        </div>

        <!-- 2. Business Impact -->
        <div
          class="text-body text-secondary mb-16 flex flex-col gap-4 leading-relaxed"
        >
          <h2 class="font-heading text-h2 text-acc2 text-center font-bold">
            The Business Impact
          </h2>
          <p>
            Sustainability goes hand-in-hand with web performance. A green
            website is a fast website.
          </p>
          <p>
            Dropping your page weight doesn't just lower your CO₂ emissions; it
            slashes loading times.
          </p>
          <p>
            Retail giants like Amazon and Google have proven that even a
            100-millisecond delay in page load speeds can drop user conversion
            rates by 7% to 10%.
          </p>
          <p>
            See
            <a
              href="https://web.dev"
              target="_blank"
              class="text-acc2 hover:text-acc2/80 underline underline-offset-2"
              >Google's Core Web Vitals Guide</a
            >
            to learn how search engines rank lightweight, eco-friendly websites
            higher.
          </p>
        </div>

        <!-- 3. User Impact -->
        <div
          class="text-body text-secondary mb-16 flex flex-col gap-4 leading-relaxed"
        >
          <h2 class="font-heading text-h2 text-acc2 text-center font-bold">
            The Accessibility Problem
          </h2>
          <p>
            Bloated websites punish users who aren't on high-speed fiber
            networks.
          </p>
          <p>
            Across parts of Africa where connectivity is slower and mobile data
            costly, millions of people still rely on older smartphones and 3G/4G
            connections. For example, in Sub-Saharan Africa, almost two-thirds
            of mobile internet users still access the web through 3G devices.
          </p>
          <p>
            For these users, loading a massive website can mean spending more of
            their income on data and waiting longer for pages to load. To craft
            lightweight websites is not just a performance decision — it’s a
            matter of digital inclusion and accessibility.
          </p>
        </div>
      </div>

      <!-- Three Pillars (Wider grid with clean, subtle card containers) -->
      <div class="mt-24 grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Card 1 -->
        <div
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-6 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:globe-africa" size="48" />
          </div>
          <h3 class="font-heading text-h3 text-acc2 mb-2 font-bold">
            The Green Pillar
          </h3>
          <p class="text-body text-secondary/90 text-sm leading-relaxed">
            Lower your digital footprint.
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-6 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:speedometer-3" size="48" />
          </div>
          <h3 class="font-heading text-h3 text-acc2 mb-2 font-bold">
            The Fast Pillar
          </h3>
          <p class="text-body text-secondary/90 text-sm leading-relaxed">
            Boost your SEO and sales.
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-6 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:tree-4" size="48" />
          </div>
          <h3 class="font-heading text-h3 text-acc2 mb-2 font-bold">
            The Fair Pillar
          </h3>
          <p class="text-body text-secondary/90 text-sm leading-relaxed">
            Make the web accessible to everyone.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
