<template>
    <div class="form-container">
        <pf-card class="form-card">
            <div class="card-header">
                <h1>Forgot Password</h1>
                <p class="subtitle">We'll send you a reset link</p>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="input-group">
                    <input v-model="email" type="text" placeholder="Enter your email" :class="{ error: error }">
                    <span class="error-message">{{ error }}</span>
                </div>

                <pf-button class="pf-c-button login-button">
                    <span>Send Reset Link</span>
                </pf-button>

                <div class="links-container">
                    <NuxtLink to="/login" class="register-link">
                        Back to <strong>Login</strong>
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
import { rules } from '~/server/utils/validation'
const config = useRuntimeConfig()

const router = useRouter()
const email = ref('')
const error = ref('')

async function handleSubmit() {
    if (!email.value.trim()) {
        error.value = 'Email is required'
        return
    }

    if (!rules.email.test(email.value)) {
        error.value = 'Email should contain "@" and "."'
        return
    }

    error.value = ''

    try {
        await $fetch(`${config.public.API_BASE_URL}/api/auth/send-reset-email`, {
            method: 'POST',
            body: { email: email.value }
        })

        email.value = ''
        router.push('/login')

    } catch {
        error.value = 'Failed to send reset link. Please try again.'
    }
}
</script>
