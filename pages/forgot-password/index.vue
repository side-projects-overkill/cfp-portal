<template>
    <pf-card class="form-card">
        <h1>Reset your Password</h1>
        <form @submit.prevent="handleSubmit">
            <input v-model="email" type="text" placeholder="Enter your email">
            <span>{{ error }}</span>

            <pf-button class="pf-c-button">Send Reset Link</pf-button>
            <NuxtLink to="/login" class="back-link">Back to Login</NuxtLink>
        </form>
    </pf-card>
</template>

<script setup>
import '@patternfly/elements/pf-card/pf-card.js';
import '@patternfly/elements/pf-button/pf-button.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import emailjs from '@emailjs/browser'
import { v4 as uuidv4 } from 'uuid'
import { rules } from '~/server/utils/validation';

const router = useRouter()

const email = ref('')
const error = ref('')
const message = ref('')

const SERVICE_ID = 'service_r6tk9ii'
const TEMPLATE_ID = 'template_2dmls66'
const PUBLIC_KEY = 'pAWKcYpKic8yzixYp'

function handleSubmit() {
    if (!email.value.trim()) {
        error.value = 'Email is required'
        return
    }

    if (!rules.email.test(email.value)) {
        error.value = 'Email should contain "@" and "."'
        return
    }

    error.value = ''
    const token = uuidv4()
    const resetLink = `http://localhost:3000/reset-password?token=${token}`

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        user_email: email.value,
        link: resetLink
    }, PUBLIC_KEY)
        .then(() => {
            message.value = "Resent link sent to your mail"
            email.value = ''
        })
        .catch((err) => {
            console.err("EmailJs error", err)
            message.value = "Failed to send reset email. Try again."
        })
    router.push('/login')
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

.back-link {
    text-align: center;
    font-size: 0.9rem;
    color: #007bff;
    text-decoration: none;
    margin-top: -0.3rem;
}

.back-link:hover {
    text-decoration: underline;
}

/* Responsive */
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

    .back-link {
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
