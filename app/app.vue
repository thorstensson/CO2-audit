<script setup>
  useSeoMeta({
    title: 'CO2 Audit • Thomas Thorstensson',
    titleTemplate: '%s • CO2 Audit',
    description:
      'Track and optimize the carbon footprint of your web applications. Get actionable asset-by-asset breakdowns built with Nuxt 4 and Puppeteer.',

    // Open Graph / Facebook / Discord
    ogTitle: 'CO2 Audit - Web Sustainability Analytics',
    ogDescription:
      "Analyze your website's environmental impact. Real-time percentage breakdowns of HTML, JS, CSS, and image weights.",
    ogType: 'website',
    ogUrl: 'https://co2audit.app',
    ogImage: 'https://co2audit.app/ogimage.jpg',

    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: 'CO2 Audit - Web Sustainability Analytics',
    twitterDescription:
      'Track and optimize the carbon footprint of your web applications.',
    twitterImage: 'https://co2audit.app/ogimage.jpg',
  })
</script>

<template>
  <div>
    <ONav />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>
