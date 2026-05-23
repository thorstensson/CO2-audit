<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const isOpen = ref(false)
  const navItems = ['WHY', 'HOW']

  const activeRoute = computed(() => route.path)

  // Automatically syncs the body overflow class across SSR, resizing, and unmounting
  useHead({
    bodyAttrs: {
      class: computed(() => (isOpen.value ? 'max-md:overflow-hidden' : '')),
    },
  })

  // Watch for route transitions to automatically shut down the overlay container
  watch(activeRoute, () => {
    isOpen.value = false
  })

  function toggle() {
    isOpen.value = !isOpen.value
  }
</script>

<template>
  <nav>
    <!-- Desktop nav bar -->
    <div
      class="bg-primary/80 fixed top-0 left-0 z-50 hidden w-full backdrop-blur-sm md:block print:hidden"
    >
      <div class="w-full px-4 py-4 md:px-[4vw]">
        <div class="flex items-center justify-between">
          <MHeader />

          <!-- 1. PLUGGED IN DESKTOP MOLECULE HERE -->
          <div class="flex items-center gap-12">
            <ul class="flex items-center gap-8">
              <li
                v-for="item in navItems"
                :key="item"
                class="font-heading text-secondary hover:text-secondary/80 cursor-pointer text-sm font-semibold tracking-widest transition-colors duration-300"
              >
                <NuxtLink
                  v-if="item === 'WHY'"
                  to="/why"
                  :class="
                    activeRoute === '/why' ? 'text-acc2' : 'text-secondary'
                  "
                  class="hover:text-secondary/80 transition-colors duration-300"
                >
                  WHY
                </NuxtLink>
                <NuxtLink
                  v-else-if="item === 'HOW'"
                  to="/how"
                  :class="
                    activeRoute === '/how' ? 'text-acc2' : 'text-secondary'
                  "
                  class="hover:text-secondary/80 transition-colors duration-300"
                >
                  HOW
                </NuxtLink>
                <span v-else>{{ item }}</span>
              </li>
            </ul>

            <MAuthControl mode="desktop" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: top bar (always visible) -->
    <div
      class="bg-primary/80 fixed top-0 left-0 z-50 w-full backdrop-blur-sm md:hidden print:hidden"
    >
      <div class="w-full px-4 py-4 md:px-[4vw]">
        <div class="flex items-center justify-between">
          <MHeader @click="isOpen = false" />
          <button
            @click="toggle"
            :aria-expanded="isOpen"
            class="font-heading text-secondary hover:text-secondary/80 text-sm font-semibold tracking-widest transition-colors duration-300"
          >
            {{ isOpen ? 'CLOSE' : 'MENU' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile: slide-in overlay from right -->
    <div
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      class="bg-primary/80 fixed inset-0 z-40 flex flex-col items-end justify-center pr-4 backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden md:pr-[4vw] print:hidden"
    >
      <ul class="space-y-10 text-right">
        <li
          v-for="item in navItems"
          :key="item"
          class="font-heading text-secondary hover:text-secondary/80 cursor-pointer text-5xl font-semibold tracking-widest transition-colors duration-300"
        >
          <NuxtLink
            v-if="item === 'WHY'"
            to="/why"
            :class="activeRoute === '/why' ? 'text-acc2' : 'text-secondary'"
            class="hover:text-secondary/80 transition-colors duration-300"
            @click="isOpen = false"
          >
            WHY
          </NuxtLink>
          <NuxtLink
            v-else-if="item === 'HOW'"
            to="/how"
            b
            :class="activeRoute === '/how' ? 'text-acc2' : 'text-secondary'"
            class="hover:text-secondary/80 transition-colors duration-300"
            @click="isOpen = false"
          >
            HOW
          </NuxtLink>
          <span v-else @click="isOpen = false">{{ item }}</span>
        </li>
      </ul>

      <!-- 2. PLUGGED IN MOBILE MOLECULE HERE -->
      <div class="mt-10 pr-4">
        <MAuthControl mode="mobile" @click="isOpen = false" />
      </div>

      <div class="text-secondary mt-6 flex gap-4 pr-4">
        <MSocial />
      </div>
    </div>
  </nav>
</template>
