<template>
  <div>
    <h1>Redirecting to Dashboard...</h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

navigateTo('/admin/dashboard')
</script>