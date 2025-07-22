<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login with GitHub</h1>
      <button @click="login" class="login-btn" :disabled="isLoading">
        <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.78-1.34-1.78-1.1-.75.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.39 1.24-3.22-.13-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.26 2.87.13 3.17.77.83 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        <span v-if="!isLoading">Login with GitHub</span>
        <span v-else>Connecting...</span>
      </button>
      <p class="admin-link">Sign in as Admin</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
definePageMeta({
  layout: 'auth' 
})
const supabase = useSupabaseClient()
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  isLoading.value = true
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://cfp-portal-git-cfp-7-github-a-0ff772-rutujakirad-4244s-projects.vercel.app/dashboard', // For development: https://cfp-portal-git-cfp-7-github-a-0ff772-rutujakirad-4244s-projects.vercel.app/dashboard
          // For production: https://cfp-portal.vercel.app/dashboard
      }
    })
    if (error) console.error('Login error:', error)
  } catch (err) {
    console.error('Auth error:', err)
  }
}
</script>

<style>
.body{
  margin: 0 !important;
}

.login-container {
  font-family: 'Red Hat Display', sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #1f2937;
}

.login-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 32px 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.login-title {
  font-size: 22px;
  margin-bottom: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #4f46e5, #6d28d9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5b50ea, #7b37f4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.github-icon {
  width: 20px;
  height: 20px;
}

.admin-link {
  margin-top: 16px;
  font-size: 14px;
  color: #374151;
  text-decoration: underline;
  cursor: pointer;
}
</style>
