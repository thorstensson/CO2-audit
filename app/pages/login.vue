<script setup lang="ts">
import { ref } from 'vue'

const supabase = useSupabaseClient()
const email = ref('')
const isLoading = ref(false)
const linkSent = ref(false)

async function handleMagicLinkLogin() {
  if (!email.value) return
  isLoading.value = true

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        // Explicitly format with a trailing slash to satisfy Supabase URL matching rules
        emailRedirectTo: `${window.location.origin}/`
      }
    })

    if (error) throw error
    linkSent.value = true
  } catch (err: any) {
    alert(`Authentication failed: ${err.message}`)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

      <!-- Heading Title Header -->
      <div class="text-center">
        <h2 class="text-3xl font-heading font-black text-gray-900 tracking-tight">
          Save your progress
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Enter your email below to log in or sign up instantly. No passwords needed.
        </p>
      </div>

      <!-- Success Notification View -->
      <div v-if="linkSent" class="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
        <p class="text-sm font-semibold text-green-900">Check your inbox!</p>
        <p class="text-xs text-green-700 mt-1">
          We sent a secure authentication Magic Link to <span class="font-bold">{{ email }}</span>.
        </p>
      </div>

      <!-- Interactive Input Form View -->
      <form v-else @submit.prevent="handleMagicLinkLogin" class="mt-8 space-y-4">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            v-model="email"
            type="email"
            required
            placeholder="developer@example.com"
            :disabled="isLoading"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:bg-gray-400"
        >
          {{ isLoading ? 'Sending Link...' : 'Send Magic Link' }}
        </button>
      </form>

      <!-- Cancel Route Return Anchor -->
      <div class="text-center mt-4">
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
          Back to Homepage
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
