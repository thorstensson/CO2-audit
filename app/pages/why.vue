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
            I built this app to highlight the impact of CO₂ emissons on the web.
            I do not pretend to wear green socks, but we all have to start
            somewhere.
          </p>
          <p>
            The internet isn't invisible; it runs on coal-and-gas-powered data
            centers that stay turned on 24/7. The digital ecosystem is
            responsible for roughly 2.1% to 4% of global greenhouse gas
            emissions—equivalent to the entire global aviation industry.
          </p>

          <p>
            Every megabyte downloaded emits CO₂. Heavy, unoptimized websites
            with uncompressed images and bloated scripts quietly add to the
            internet’s growing climate footprint with every page view. Invisible
            jet fuel.
          </p>
          <p>
            Read more at
            <a
              href="https://sustainablewebmanifesto.com"
              target="_blank"
              class="underline underline-offset-2"
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
            There's a forest, and its's leafy, green, and I walk there picking
            mushrooms. Still, there's some digital benefits that live on the
            distant motorway:
          </p>
          <p class="flex items-start gap-2">
            <Icon name="glyphs-poly:leaf" class="mt-1 shrink-0" size="1em" />
            Sustainable websites reduce the energy required to serve every page,
            lowering the environmental footprint of your digital presence across
            hosting, data transfer, and user devices.
          </p>
          <p class="flex items-start gap-2">
            <Icon name="glyphs-poly:leaf" class="mt-1 shrink-0" size="1em" />
            Lean, efficient websites load faster, score better in Lighthouse
            audits, and support stronger SEO performance — improving both user
            experience and search visibility.
          </p>
          <p class="flex items-start gap-2">
            <Icon name="glyphs-poly:leaf" class="mt-1 shrink-0" size="1em" />
            Demonstrating environmental responsibility online can strengthen
            brand trust, helping companies align their digital presence with the
            values customers, partners, and employees increasingly expect.
          </p>
          <p>
            See
            <a
              href="https://web.dev"
              target="_blank"
              class="underline underline-offset-2"
              >Google's Core Web Vitals Guide</a
            >
            to find out more about how search engines rank eco-friendly websites
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
            It's easy to forget that in many parts of the world, any thing above
            basic text apps and basic map apps, take forever to load, if at all.
          </p>
          <p>
            In many parts of Africa, millions of people still rely on older
            smartphones and slower mobile networks. Case in point, Ethiopia,
            where deep rural and agricultural comuninties are accustomed to
            2G/3G wires. Or consider Sub-Saharan Africa, where almost two-thirds
            of mobile internet users still access the web through 3G devices.
          </p>
          <p>
            For these folks, loading a non-optimized website means high data
            tarrifs and long waits.
          </p>
          <p>
            To craft lightweight websites is not just a performance decision—
            it’s a matter of digital inclusion and accessibility.
          </p>
        </div>
      </div>

      <!-- Three Pillars (Wider grid with clean, subtle card containers) -->
      <div class="mt-24 grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Card 1 -->
        <div
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-4 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:globe-africa" size="94" />
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
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-4 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:speedometer-3" size="94" />
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
          class="border-secondary/10 bg-secondary/5 rounded-2xl border p-4 text-center transition-all"
        >
          <div class="mb-4 flex justify-center">
            <Icon name="glyphs-poly:tree-4" size="94" />
          </div>
          <h3 class="font-heading text-h3 text-acc2 mb-2 font-bold">
            The Fair Pillar
          </h3>
          <p class="text-body text-secondary/90 text-sm leading-relaxed">
            Make the web accessible.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
