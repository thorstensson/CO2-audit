<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);

const navItems = ["WHY", "HOW", "CONTRIBUTE"];

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <nav>
      <!-- Desktop nav bar -->
      <div
        class="fixed top-0 left-0 z-50 w-full hidden md:block bg-white/80 backdrop-blur-sm"
      >
        <div class="w-full px-[4vw] py-4">
          <div class="flex items-center justify-between">
            <MHeader />
            <ul class="flex items-center gap-8">
              <li
                v-for="item in navItems"
                :key="item"
                class="font-heading text-sm font-semibold tracking-widest text-black hover:text-gray-400 transition-colors duration-300 cursor-pointer"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mobile: top bar (always visible) -->
      <div
        class="fixed top-0 left-0 z-50 w-full md:hidden bg-white/80 backdrop-blur-sm"
      >
        <div class="w-full px-[4vw] py-4">
          <div class="flex items-center justify-between">
            <MHeader />
            <button
              @click="toggle"
              class="font-heading text-sm font-semibold tracking-widest text-black hover:text-gray-400 transition-colors duration-300"
            >
              {{ isOpen ? "CLOSE" : "MENU" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile: slide-in overlay from right -->
      <div
        :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
        class="fixed inset-0 z-40 md:hidden bg-white/80 backdrop-blur-sm flex items-center justify-end pr-[4vw] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        <ul class="text-right space-y-10">
          <li
            v-for="item in navItems"
            :key="item"
            class="font-heading text-5xl font-semibold tracking-widest text-black hover:text-gray-400 transition-colors duration-300 cursor-pointer"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </nav>
</template>
