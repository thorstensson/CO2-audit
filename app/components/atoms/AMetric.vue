<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string | number;
    label: string;
  }>(),
  {
    value: "—",
  }
);
</script>

<template>
  <div class="text-center">
    <p class="font-heading text-4xl font-bold text-black">{{ value }}</p>
    <p
      class="mt-2 text-sm text-gray-400 uppercase tracking-widest font-heading font-semibold"
    >
      {{ label }}
    </p>
  </div>
</template>
