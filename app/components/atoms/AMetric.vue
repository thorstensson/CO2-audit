<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string | number;
    label: string;
    valueClass?: string;
  }>(),
  {
    value: "—",
    valueClass: "text-acc3",
  }
);
</script>

<template>
  <div class="text-center text-secondary">
    <p class="font-heading text-4xl font-semibold" :class="valueClass">{{ value }}</p>
    <p
      class="text-sm uppercase tracking-widest font-heading font-semibold"
    >
      {{ label }}
    </p>
  </div>
</template>
