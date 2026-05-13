<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "green" | "outline";
    label: string;
    to?: string;
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    disabled: false,
  }
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'px-6 py-3 font-semibold rounded-lg transition text-center flex items-center justify-center',
      variant === 'green'
        ? 'bg-green-600 text-white hover:bg-green-700'
        : variant === 'outline'
          ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          : variant === 'secondary'
            ? 'px-8 py-4 font-heading text-sm uppercase tracking-widest rounded-full border border-gray-200 text-black hover:border-gray-400'
            : 'px-8 py-4 font-heading text-sm uppercase tracking-widest rounded-full bg-black text-white hover:bg-gray-800',
    ]"
  >
    {{ label }}
  </NuxtLink>

  <button
    v-else
    :disabled="disabled"
    :class="[
      'font-semibold rounded-lg transition',
      variant === 'green'
        ? 'px-6 py-3 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
        : variant === 'outline'
          ? 'px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          : variant === 'secondary'
            ? 'px-8 py-4 font-heading text-sm uppercase tracking-widest rounded-full border border-gray-200 text-black hover:border-gray-400'
            : 'px-8 py-4 font-heading text-sm uppercase tracking-widest rounded-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400',
    ]"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
