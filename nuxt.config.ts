import tailwindcss from "@tailwindcss/vite";
const fontBase = process.env.NUXT_EVERETT_FONT_URL;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss() as any],
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/seo",
    "nuxt-svgo",
    "@nuxtjs/supabase",
  ],

  components: [
      // Scans your atomic folders for auto-importing
      { path: '~/components/atoms', prefix: 'A' },
      { path: '~/components/molecules', prefix: 'M' },
      { path: '~/components/organisms', prefix: 'O' },

      // Keep the default components folder if you still use it
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
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/api/scan"], // Allow access to home and the scanner
    },
  },
});
