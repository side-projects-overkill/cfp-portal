<template>
    <div class="form-container">
        <h1>Reset your Password</h1>
        <form @submit.prevent="handleSubmit">
            <input v-model="email" type="text" placeholder="Enter your email" >
            <span>{{ error }}</span>

            <button type="submit">Send Reset Link</button>

            <router-link to="/login" class="back-link">Back to Login</router-link>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()

const email = ref('')
const error = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function handleSubmit() {
    if (!email.value.trim()) {
        error.value = 'Email is required'
        return
    }

    if (!emailRegex.test(email.value)) {
        error.value = 'Email should contain "@" and "."'
        return
    }

    error.value = ''
    alert('Reset link sent to your email!')
    email.value = ''


    // router.push('/login')
}
</script>

<style scoped>
.form-container {
    width: 100%;
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    box-sizing: border-box;
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

button {
    background-color: #007bff;
    color: #ffffff;
    border: none;
    padding: 0.7rem;
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
