<template>
  <div class="form-container">
    <pf-card class="form-card">
      <div class="card-header">
        <h1>Welcome Back</h1>
        <p class="subtitle">Sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin">
        <template v-for="field in inputFields" :key="field.name">
          <div class="input-group">
            <input
              v-model="form[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              :class="{ error: errors[field.name] }"
            >
            <span class="error-message">{{ errors[field.name] }}</span>
          </div>
        </template>

        <pf-button class="pf-c-button login-button">
          <span>Sign In</span>
        </pf-button>

        <div class="links-container">
          <NuxtLink to="/forgot-password" class="forgot-link"
            >Forgot password?</NuxtLink
          >
          <NuxtLink to="/signup" class="register-link"
            >Don't have an account? <strong>Register</strong>
          </NuxtLink>
        </div>
      </form>
    </pf-card>
  </div>
</template>

<script setup>
import "@patternfly/elements/pf-card/pf-card.js";
import "@patternfly/elements/pf-button/pf-button.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { rules } from "~/server/utils/validation";
const config = useRuntimeConfig();

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const inputFields = [
  { name: "email", type: "text", placeholder: "Email" },
  { name: "password", type: "password", placeholder: "Password" },
];

const errors = ref({});

function validateField(field, value) {
  if (!value) return `${field} is required`;

  const rule = rules[field];
  if (!rule.test(value)) {
    return errorMessages[field] || "Invalid input";
  }

  return "";
}

async function handleLogin() {
  const newErrors = {};

  for (const key in form.value) {
    const error = validateField(key, form.value[key]);
    if (error) newErrors[key] = error;
  }

  errors.value = newErrors;

  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await $fetch(
        `${config.public.API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          body: {
            email: form.value.email,
            password: form.value.password,
          },
        }
      );

      alert(response.message || "Login successful!");

      form.value = {
        email: "",
        password: "",
      };

      router.push("/dashboard");
    } catch (err) {
      const msg = err?.data?.statusMessage || "Login failed. Try again.";
      alert(msg);
    }
  }
}
</script>
