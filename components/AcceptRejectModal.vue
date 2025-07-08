<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <pf-modal ?open="true" modal-title="Decision">
    <div v-if="type === 'reject'">
      <textarea
        placeholder="Reason for rejection..."
        class="pf-c-form-control"
      ></textarea>
    </div>
    <div v-else>
      Confirm acceptance of this CFP?
    </div>
    <pf-button @click="emit('close')">Save</pf-button>
  </pf-modal>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])

useHead({
  script: [
    {
      type: 'module',
      innerHTML: `
        import '@patternfly/elements/pf-modal/pf-modal.js';
        import '@patternfly/elements/pf-button/pf-button.js';
      `,
    },
  ],
})

</script>
