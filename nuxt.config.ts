import tailwindcss from "@tailwindcss/vite";
const fontBase = process.env.NUXT_EVERETT_FONT_URL;

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss() as any],
  },

  modules: [
    "@nuxt/eslint",
    '@nuxtjs/turnstile',
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/seo",
    "nuxt-svgo",
    "@nuxtjs/supabase",
  ],

  runtimeConfig: {
      // Private backend keys
      turnstile: {
        secretKey: '1x0000000000000000000000000000000AA',
      },
      // Public frontend keys
      public: {
        turnstile: {
          siteKey: '1x00000000000000000000AA',
        }
      }
  },

  components: [
      { path: '~/components/atoms', prefix: 'A' },
      { path: '~/components/molecules', prefix: 'M' },
      { path: '~/components/organisms', prefix: 'O' },
      '~/components'
    ],

  svgo: {
    autoImportPath: "./assets/svg/",
    defaultImport: "component",
  },

  css: ["./app/assets/css/main.css"],

  fonts: {
    families: [
      {
        name: "Aspekta",
        provider: "none",
        src: `${fontBase}AspektaVF.woff2`,
        weights: ["100 900"],
        style: "normal",
      },

      {
        name: "Instrument Sans",
        provider: "fontsource",
        weights: ["400 900"],
      },
    ],
  },

  supabase: {
      useSsrCookies: true, // Explicitly declare to ensure Nitro engine processes it
      cookieOptions: {
        path: "/", // Explicitly forces the auth cookie to be visible across Nuxt 4 root
        secure: process.env.NODE_ENV === 'production', // Fixes local dev cookie blocking
        sameSite: 'lax',
      },
      redirectOptions: {
        login: "/login",
        callback: "/confirm",
        exclude: ["/", "/api/scan"],
      },
    },
});
