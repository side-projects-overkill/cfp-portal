<template>
  <div class="login-wrapper">
    <pf-card class="login-card" rounded>
      <h2 class="login-title">Login with GitHub</h2>

      <button class="custom-login-btn" @click="login" :disabled="isLoading">
        <svg
          class="github-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.78-1.34-1.78-1.1-.75.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.39 1.24-3.22-.13-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.26 2.87.13 3.17.77.83 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        <span>{{ isLoading ? "Connecting..." : "Login with GitHub" }}</span>
      </button>

      <a class="admin-link" href="#">Sign in as Admin</a>
    </pf-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)

const login = () => {
  isLoading.value = true
  const clientId = useRuntimeConfig().public.githubClientId
  const redirectUri = `${window.location.origin}/api/auth/callback`
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  text-align: center;
  border: 1px solid #e5e5e5;
  background-color: white;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  font-family: 'Red Hat Text', sans-serif;
}


.login-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.custom-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #24292e;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.custom-login-btn:hover {
  background-color: #000;
}

.custom-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.github-icon {
  width: 20px;
  height: 20px;
}

.admin-link {
  display: block;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #0066cc;
  text-decoration: none;
}

.admin-link:hover {
  text-decoration: underline;
}
</style>
