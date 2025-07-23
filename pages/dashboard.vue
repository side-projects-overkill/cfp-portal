<template>
  <div class="container" v-if="user">
    <h2 class="welcome-text">
      Welcome, {{ user.username || user.email }}
    </h2>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const user = ref(null)

onMounted(() => {
  const encodedSession = route.query.session as string
  const localSession = sessionStorage.getItem('auth_user')
  const expiry = +sessionStorage.getItem('auth_expiry') || 0
  console.log(expiry)

  if (encodedSession) {
    const decoded = JSON.parse(atob(decodeURIComponent(encodedSession)))
    sessionStorage.setItem('auth_user', JSON.stringify(decoded))
    sessionStorage.setItem('auth_expiry', `${Date.now() + 60 * 60 * 1000}`) // 1 hour
    user.value = decoded
    router.replace('/dashboard') 
  } else if (localSession && Date.now() < expiry) {
    user.value = JSON.parse(localSession)
  } else {
    router.push('/')
  }
})

const logout = () => {
  sessionStorage.clear()
  router.push('/')
}
</script>
