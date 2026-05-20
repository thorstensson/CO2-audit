import tailwindcss from '@tailwindcss/vite'
const fontBase = process.env.NUXT_EVERETT_FONT_URL

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-04-03',

  devtools: { enabled: false },

  site: {
    url: 'https://co2audit.app',
    name: 'CO2 Audit',
    description: 'Measure the carbon footprint of any website.',
    defaultLocale: 'en',
  },

  ogImage: {
    zeroRuntime: true,
  },

  vite: {
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ['@tgwf/co2'],
    },
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
            'frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com',
            "connect-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
            "img-src 'self' data: https:",
            "style-src 'self' 'unsafe-inline'",
            "worker-src 'self' blob: https://challenges.cloudflare.com",
            'child-src https://challenges.cloudflare.com',
          ].join('; '),
        },
      },
    },
  },

  vue: {
    compilerOptions: {
      // Combined into a single, unified arrow function with no duplicate keys
      isCustomElement: (tag) => tag === 'suspense' || tag === 'altcha-widget',
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
  ],

  runtimeConfig: {
    maintenanceMode: false,
    altchaHmacKey: process.env.ALTCHA_HMAC_SECRET,
  },

  components: [
    { path: '~/components/atoms', prefix: 'A' },
    { path: '~/components/molecules', prefix: 'M' },
    { path: '~/components/organisms', prefix: 'O' },
    '~/components',
  ],

  svgo: {
    autoImportPath: '~/assets/svg/',
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
        name: 'Be Vietnam Pro',
        provider: 'fontsource',
        weights: ['400', '600'],
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
