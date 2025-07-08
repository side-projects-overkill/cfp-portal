<template>
  <div>
    <h1>Submit CFP</h1>
    <form @submit.prevent="submitCFP">
      <input v-model="title" placeholder="Talk Title">
      <textarea v-model="abstract" placeholder="Abstract"></textarea>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const abstract = ref('')

const submitCFP = () => {
  console.log('CFP Submitted:', title.value, abstract.value)
  // TODO: POST to backend
  title.value = ''
  abstract.value = ''
}
</script>
