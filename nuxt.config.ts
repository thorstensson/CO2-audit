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

  turnstile: {
    siteKey: '', // Set via NUXT_PUBLIC_TURNSTILE_SITE_KEY at runtime
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/turnstile',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
  ],

  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; worker-src 'self' blob: https://challenges.cloudflare.com; img-src 'self' data: https://challenges.cloudflare.com;",
      },
    },
  },

  runtimeConfig: {
    turnstile: {
      secretKey: '', // NUXT_TURNSTILE_SECRET_KEY
    },
    maintenanceMode: true, // Set via NUXT_MAINTENANCE_MODE env var
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
      }, // <-- This bracket was missing in my previous edit
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
      exclude: ['/', '/why', '/how', '/login', '/maintenance', '/api/scan'],
    },
  },
})
