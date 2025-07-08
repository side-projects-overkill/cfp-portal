<template>
  <div>
    <h1>User Dashboard</h1>

    <h2>Notifications</h2>
    <ul>
      <li v-for="note in notifications" :key="note.id">
        {{ note.message }}
      </li>
    </ul>

    <div v-if="hasConferences">
      <NuxtLink to="/submit">
        <button>Submit CFP</button>
      </NuxtLink>
    </div>
    <div v-else>
      <p>No active conferences right now. Please check back later!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dummy notifications for now
const notifications = ref([
  { id: 1, message: 'New Conference: VueConf 2025!' }
])

// Replace this with real API check later
const hasConferences = ref(false)

onMounted(async () => {
  // Example: Fetch conferences from your backend
  // const res = await $fetch('/api/conferences')
  // hasConferences.value = res && res.length > 0

  // For now, simulate a check:
  hasConferences.value = notifications.value.length > 0
})
</script>
