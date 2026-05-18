import tailwindcss from '@tailwindcss/vite'
const fontBase = process.env.NUXT_EVERETT_FONT_URL

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ['@tgwf/co2'],
    },
  },

  vue: {
    compilerOptions: {
      // This tells Vue to suppress the experimental warning natively
      isCustomElement: (tag) => tag === 'suspense',
    },
  },

  ogImage: {
    zeroRuntime: true,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/turnstile',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/supabase',
    '@nuxtjs/seo', // Moved to the end to intercept everything properly
  ],

  runtimeConfig: {
    // Private backend keys
    turnstile: {
      secretKey: '',
    },
    // Public frontend keys
    public: {
      turnstile: {
        siteKey: '',
      },
    },
  },

  components: [
    { path: '~/components/atoms', prefix: 'A' },
    { path: '~/components/molecules', prefix: 'M' },
    { path: '~/components/organisms', prefix: 'O' },
    '~/components',
  ],

  svgo: {
    autoImportPath: '~/assets/svg/', // Fixed path alias for Nuxt 4
    defaultImport: 'component',
  },

  css: ['~/assets/css/main.css'], // Fixed Nuxt 4 root path resolution

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'CO2 Audit • Thomas Thorstensson',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  fonts: {
    families: [
      {
        name: 'Aspekta',
        provider: 'none',
        src: `${fontBase}AspektaVF.woff2`,
        weights: ['100 900'],
        style: 'normal',
      },
      {
        name: 'Outfit',
        provider: 'fontsource',
        weights: ['400 900'],
      },
    ],
  },

  supabase: {
    useSsrCookies: true, // Explicitly declare to ensure Nitro engine processes it
    cookieOptions: {
      path: '/', // Explicitly forces the auth cookie to be visible across Nuxt 4 root
      secure: process.env.NODE_ENV === 'production', // Fixes local dev cookie blocking
      sameSite: 'lax',
    },
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/why', '/how', '/login', '/api/scan'],
    },
  },
})
