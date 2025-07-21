<template>
  <div class="container">
    <h2 class="welcome-text">
      Welcome, {{ user?.user_metadata?.full_name || user?.email || 'Guest' }}
    </h2>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = ref()

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    user.value = data.user
  } else {
    return navigateTo('/')
  }
})

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/')

}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  background: #f9fafb; 
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Redhat Display, sans-serif;
}

.welcome-text {
  font-size: 1.75rem;
  font-weight: 400;
  color: #333;
  margin-bottom: 1.5rem;
}

.logout-btn {
  background-color: #ef4444; 
  color: white;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.25s ease;
}

.logout-btn:hover {
  background-color: #dc2626; 
}
</style>
