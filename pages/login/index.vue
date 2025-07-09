<template>
    <pf-card class="form-card">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <template v-for="field in inputFields" :key="field.name">
                <input v-model="form[field.name]" :type="field.type" :placeholder="field.placeholder">
                <span>{{ errors[field.name] }}</span>
            </template>

            <pf-button class="pf-c-button">Login</pf-button>

            <NuxtLink to="/forgot-password" class="forgot-link">Forgot password?</NuxtLink>
        </form>
    </pf-card>

</template>

<script setup>
import '@patternfly/elements/pf-card/pf-card.js';
import '@patternfly/elements/pf-button/pf-button.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { rules } from '~/server/utils/validation';

const router = useRouter()

const form = ref({
    email: '',
    password: ''
})

const inputFields = [
    { name: 'email', type: 'text', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
]

const errors = ref({})

const errorMessages = {
    email: 'Email should contain "@" and "."',
    password: 'Password should be at least 6 characters, include letters and numbers'
}

function validateField(field, value) {
    if (!value) return `${field} is required`

    const rule = rules[field]
    if (!rule.test(value)) {
        return errorMessages[field] || 'Invalid input'
    }

    return ''
}

async function handleLogin() {
    const newErrors = {}

    for (const key in form.value) {
        const error = validateField(key, form.value[key])
        if (error) newErrors[key] = error
    }

    errors.value = newErrors

    if (Object.keys(newErrors).length === 0) {
        const apiBase = useRuntimeConfig().public.API_BASE_URL
        try {
            const response = await $fetch(`${apiBase}/api/auth/login`, {
                method: 'POST',
                body: {
                    email: form.value.email,
                    password: form.value.password
                }
            })

            alert(response.message || 'Login successful!')

            form.value = {
                email: '',
                password: ''
            }

            router.push('/dashboard')
        } catch (err) {
            const msg = err?.data?.statusMessage || 'Login failed. Try again.'
            alert(msg)
        }
    }
}
</script>

<style scoped>
* {
    font-family: 'Times New Roman', Times, serif;
}

.form-card {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    display: block;
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #222222;
    font-size: 1.8rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

input {
    padding: 0.6rem;
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

span {
    color: #ff0000;
    font-size: 0.8rem;
    display: block;
    margin-top: -0.4rem;
}

.pf-c-button {
    width: 80px;
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



.forgot-link {
    text-align: right;
    font-size: 0.9rem;
    color: #007bff;
    text-decoration: none;
    margin-top: -0.5rem;
}

.forgot-link:hover {
    text-decoration: underline;
}


@media (max-width: 768px) {
    .form-container {
        margin: 2rem 1rem;
        padding: 1.5rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    input,
    button {
        font-size: 0.95rem;
    }

    .forgot-link {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .form-container {
        padding: 1rem;
    }

    input,
    button {
        font-size: 0.9rem;
    }
}
</style>
