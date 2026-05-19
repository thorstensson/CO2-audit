<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      variant?: 'green' | 'outline' | 'accent'
      label: string
      to?: string
      disabled?: boolean
      type?: 'button' | 'submit' | 'reset'
    }>(),
    {
      variant: 'green',
      disabled: false,
    }
  )

  const emit = defineEmits<{
    click: []
  }>()

  const variantStyles: Record<string, string> = {
    // Ometrics
    green:
      'px-6 py-3 bg-acc2 text-secondary hover:bg-acc2/80 rounded-lg shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)]',
    // Ometrics Outline
    outline:
      'px-6 py-3 bg-primary border border-secondary/50 text-secondary-100 hover:bg-acc3/20 rounded-lg shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)]',
    // Login CTA — full-width bright button
    accent:
      'w-full px-6 py-3 bg-acc1 text-primary font-semibold hover:bg-acc1/80 rounded-lg shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)]',
  }

  const classes = computed(() => {
    return variantStyles[props.variant ?? 'green'] ?? variantStyles.green
  })
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="[
      'flex cursor-pointer items-center justify-center text-center transition-all duration-150',
      classes,
    ]"
  >
    {{ props.label }}
  </NuxtLink>

  <button
    v-else
    :type="props.type ?? 'button'"
    :disabled="props.disabled"
    :class="[
      classes,
      'cursor-pointer transition-all duration-150',
      {
        'disabled:bg-gray-400':
          props.variant === 'green' || props.variant === 'accent',
      },
    ]"
    @click="emit('click')"
  >
    {{ props.label }}
  </button>
</template>
