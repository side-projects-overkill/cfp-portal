<template>
    <pf-card class="form-card">
        <h1>Reset your Password</h1>
        <form @submit.prevent="handleSubmit">
            <template v-for="field in inputFields" :key="field.name">
                <input v-model="form[field.name]" :type="field.type" :placeholder="field.placeholder">
                <span>{{ errors[field.name] }}</span>
            </template>
            <pf-button class="pf-c-button">Send Reset Link</pf-button>

        </form>
    </pf-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@patternfly/elements/pf-card/pf-card.js';
import '@patternfly/elements/pf-button/pf-button.js'
import { rules } from '~/server/utils/validation';

const route = useRoute()
const router = useRouter()

const form = ref({
    password: '',
    confirm_password: ''
})

const errors = ref({})

const inputFields = [
    { name: 'password', type: 'password', placeholder: 'New Password' },
    { name: 'confirm_password', type: 'password', placeholder: 'Confirm Password' }
]

function validateField(field, value) {
    if (!value) return `${field} is required`
    const rule = rules[field]
    if (!rule.password.test(value)) {
        return 'Password must be at least 6 characters and include letters and numbers.'
    }
    return ''
}

async function handleSubmit() {
    const newErrors = {}

    for (const key in form.value) {
        const error = validateField(key, form.value[key])
        if (error) newErrors[key] = error
    }

    if (form.value.password !== form.value.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match.'
    }

    errors.value = newErrors

    if (Object.keys(newErrors).length === 0) {
        const apiBase = useRuntimeConfig().public.API_BASE_URL
        const token = route.query.token

        if (!token) {
            alert('Invalid or missing token.')
            return
        }

        try {
            const response = await $fetch(`${apiBase}/api/auth/reset-password`, {
                method: 'POST',
                body: {
                    token,
                    newPassword: form.value.password
                }
            })
            alert(response.message || 'Password reset successful!')
            form.value = { password: '', confirm_password: '' }

            setTimeout(() => router.push('/login'), 2000)
        } catch (err) {
            alert(err?.data?.message || 'Reset failed. Token may be invalid or expired.')
        }
    }
}
</script>

<style scoped>
.form-card {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    display: block;
}


h1 {
    text-align: center;
    margin-bottom: 1.5rem;
}

input {
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

span {
    color: red;
    font-size: 0.85rem;
    display: block;
    margin-bottom: 1rem;
}

.pf-c-button {
    width: 150px;
    align-self: center;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.success-message {
    margin-top: 1rem;
    color: green;
    text-align: center;
}
</style>
