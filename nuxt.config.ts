// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ],

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY, 
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
      supabaseUrl: process.env.SUPABASE_URL 
    }
  }
})

