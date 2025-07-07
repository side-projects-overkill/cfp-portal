<template>
    <div class="form-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="handleSignup">
            <template v-for="field in inputFields" :key="field.name">
                <input v-model="form[field.name]" :type="field.type" :placeholder="field.placeholder" >
                <span>{{ errors[field.name] }}</span>
            </template>

            <select v-model="form.role">
                <option disabled value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <span>{{ errors.role }}</span>

            <button type="submit">Sign Up</button>
        </form>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

const rules = {
    name: /^[A-Za-z\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
    role: /^(user|admin)$/i
}

function validateField(field, value) {
    if (!value) return `${field} is required`

    const rule = rules[field]
    if (!rule.test(value)) {
        switch (field) {
            case 'name':
                return 'Name should be letters only — no digits or special characters'
            case 'email':
                return 'Email should contain "@" and "."'
            case 'password':
                return 'Password should be at least 6 characters, include letters and numbers'
            case 'role':
                return 'Role must be either user or admin'
        }
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
        // try {
        //     await $fetch('/api/admin/register', {
        //         method: 'POST',
        //         body: form.value
        //     })

        //     alert('Registration successful!')

        //     form.value = {
        //         name: '',
        //         email: '',
        //         password: '',
        //         role: ''
        //     }
        //     router.push('/login')
        // } catch (err) {
        //     alert(err?.data?.message || 'Registration failed.')
        // }
        alert('Registration successful!')
        form.value = {
            name: '',
            email: '',
            password: '',
            role: ''
        }
        router.push('/login')

    }

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

input,
select {
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


@media (max-width: 768px) {
    .form-container {
        margin: 2rem 1rem;
        padding: 1.5rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    input,
    select,
    button {
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .form-container {
        padding: 1rem;
    }

    input,
    select,
    button {
        font-size: 0.9rem;
    }
}
</style>
