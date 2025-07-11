<template>
    <div class="form-container">
        <pf-card class="form-card">
            <div class="card-header">
                <h1>Create Account</h1>
                <p class="subtitle">Join us by creating a new account</p>
            </div>

            <form @submit.prevent="handleSignup">
                <template v-for="field in inputFields" :key="field.name">
                    <div class="input-group">
                        <input v-model="form[field.name]" :type="field.type" :placeholder="field.placeholder"
                            :class="{ error: errors[field.name] }" />
                        <span class="error-message">{{ errors[field.name] }}</span>
                    </div>
                </template>

                <div class="input-group">
                    <select v-model="form.role" :class="{ error: errors.role }">
                        <option disabled value="">Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <span class="error-message">{{ errors.role }}</span>
                </div>

                <pf-button class="pf-c-button login-button">
                    <span>Sign Up</span>
                </pf-button>

                <div class="links-container">
                    <NuxtLink to="/login" class="register-link">
                        Already have an account? <strong>Login</strong>
                    </NuxtLink>
                </div>
            </form>
        </pf-card>
    </div>
</template>

<script setup>
import '@patternfly/elements/pf-card/pf-card.js'
import '@patternfly/elements/pf-button/pf-button.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { rules, errorMessages } from '~/server/utils/validation'
const config = useRuntimeConfig()

const router = useRouter()

const form = ref({
    name: '',
    email: '',
    password: '',
    role: ''
})

const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Name' },
    { name: 'email', type: 'text', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
]

const errors = ref({})

function validateField(field, value) {
    if (!value) return `${field} is required`

    const rule = rules[field]
    if (!rule.test(value)) {
        return errorMessages[field] || 'Invalid field'
    }
    return ''
}

async function handleSignup() {
    const newErrors = {}

    for (const key in form.value) {
        const error = validateField(key, form.value[key])
        if (error) newErrors[key] = error
    }

    errors.value = newErrors

    if (Object.keys(newErrors).length === 0) {
        try {
            const response = await $fetch(`${config.public.API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                body: {
                    name: form.value.name,
                    email: form.value.email,
                    password: form.value.password,
                    role: form.value.role.toUpperCase()
                }
            })

            alert(response.message || 'Registration successful!')

            form.value = {
                name: '',
                email: '',
                password: '',
                role: ''
            }

            router.push('/login')
        } catch (err) {
            const msg = err?.data?.statusMessage || 'Registration failed.'
            alert(msg)
        }
    }
}
</script>
