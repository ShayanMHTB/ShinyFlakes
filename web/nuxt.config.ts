// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'shadcn-nuxt'
  ],

  // TypeScript configuration
  typescript: {
    typeCheck: true
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3333/api',
      appName: 'ShinyFlakes',
      appDescription: 'A parody e-commerce inspired by How to Sell Drugs Online (Fast)'
    }
  },

  // Nitro configuration for development proxy
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3333/api',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },

  // App configuration
  app: {
    head: {
      title: 'ShinyFlakes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'A parody e-commerce website inspired by How to Sell Drugs Online (Fast)' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Development configuration
  devServer: {
    port: 3000
  }
})