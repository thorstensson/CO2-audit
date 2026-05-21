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
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
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
  <section class="flex min-h-screen items-center justify-center">
    <div
      class="bg-secondary flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-gray-100 p-8"
    >
      <!-- Heading Title Header -->
      <div class="text-center">
        <h2 class="font-heading text-primary text-3xl font-bold tracking-tight">
          Save your progress
        </h2>
        <p class="text-primary text-base">
          Enter your email below to log in or sign up instantly. No passwords
          needed.
        </p>
      </div>

      <!-- Success Notification View -->
      <div
        v-if="linkSent"
        class="rounded-xl border border-green-200 bg-green-50 p-4 text-center"
      >
        <p class="text-sm font-semibold text-green-900">Check your inbox!</p>
        <p class="mt-1 text-xs text-green-700">
          We sent a secure authentication Magic Link to
          <span class="font-bold">{{ email }}</span
          >.
        </p>
      </div>

      <!-- Interactive Input Form View -->
      <div v-else class="!my-0 flex h-fit flex-col gap-4 self-start">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            v-model="email"
            type="email"
            required
            placeholder="developer@example.com"
            :disabled="isLoading"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
            @keydown.enter="handleMagicLinkLogin"
          />
        </div>

        <AButton
          variant="accent"
          :label="isLoading ? 'Sending Link...' : 'Send Magic Link'"
          :disabled="isLoading"
          @click="handleMagicLinkLogin"
        />

        <p class="text-primary text-center text-xs leading-relaxed">
          By logging in, you agree to our use of essential session cookies to
          keep you authenticated. See our footer for details.
        </p>
      </div>

      <!-- Cancel Route Return Anchor -->
      <div class="text-center">
        <NuxtLink
          to="/"
          class="text-primary hover:text-primary/80 text-xs underline underline-offset-2"
        >
          Back to Homepage
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
