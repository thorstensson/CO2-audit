<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary";
    label: string;
  }>(),
  {
    variant: "primary",
  }
);
</script>

<template>
  <button
    :class="[
      'px-8 py-4 font-heading font-semibold text-sm uppercase tracking-widest rounded-full transition-colors duration-300',
      variant === 'primary'
        ? 'bg-black text-white hover:bg-gray-800'
        : 'border border-gray-200 text-black hover:border-gray-400',
    ]"
  >
    {{ label }}
  </button>
</template>
