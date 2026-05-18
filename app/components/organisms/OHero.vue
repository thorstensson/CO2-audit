<script setup lang="ts">
  withDefaults(
    defineProps<{
      heading: string
      highlight: string
      description: string
      showSearch?: boolean
    }>(),
    {
      showSearch: false,
    }
  )
</script>

<template>
  <!-- Hero section -->
  <section class="pt-32">
    <div class="mx-auto flex max-w-4xl flex-col gap-8 text-center">
      <h1
        class="font-heading text-hero text-secondary leading-tight font-bold tracking-tight"
      >
        {{ heading }}<br />
        <span class="text-acc2">{{ highlight }}</span>
      </h1>
      <p
        class="font-body text-body text-secondary mx-auto max-w-2xl leading-relaxed"
      >
        {{ description }}
      </p>

      <MSearchInput v-if="showSearch" />
    </div>
  </section>
</template>
