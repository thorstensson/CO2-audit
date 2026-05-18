<template>
  <div class="flex items-center justify-center gap-2 py-8">
    <span
      v-for="i in 3"
      :key="i"
      class="w-2 h-2 rounded-full bg-acc2 animate-pulse-scale"
      :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
    />
  </div>
</template>

<style scoped>
@keyframes pulse-scale {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-pulse-scale {
  animation: pulse-scale 1.4s ease-in-out infinite;
}
</style>
