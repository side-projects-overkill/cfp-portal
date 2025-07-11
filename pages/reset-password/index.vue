<template>
  <div class="form-container">
    <pf-card class="form-card">
      <div class="card-header">
        <h1>Reset your Password</h1>
        <p class="subtitle">Enter a new password for your account</p>
      </div>
      <form @submit.prevent="handleSubmit">
        <template v-for="field in inputFields" :key="field.name">
          <div class="input-group">
            <input
              v-model="form[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              :class="{ error: errors[field.name] }"
            />
            <span class="error-message">{{ errors[field.name] }}</span>
          </div>
        </template>

        <pf-button class="pf-c-button login-button">
          <span>Submit</span>
        </pf-button>
      </form>
    </pf-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@patternfly/elements/pf-card/pf-card.js";
import "@patternfly/elements/pf-button/pf-button.js";
import { rules } from "~/server/utils/validation";
const config = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const form = ref({
  password: "",
  confirm_password: "",
});

const errors = ref({});

const inputFields = [
  { name: "password", type: "password", placeholder: "New Password" },
  {
    name: "confirm_password",
    type: "password",
    placeholder: "Confirm Password",
  },
];

const fieldLabels = {
  password: "Password",
  confirm_password: "Confirm Password",
};

function validateField(field, value) {
  if (!value) return `${fieldLabels[field]} is required`;

  if (field === "password" && !rules.password.test(value)) {
    return "Password must be at least 6 characters and include letters and numbers.";
  }

  return "";
}

async function handleSubmit() {
  const newErrors = {};

  for (const key in form.value) {
    const error = validateField(key, form.value[key]);
    if (error) newErrors[key] = error;
  }

  if (
    form.value.password &&
    form.value.confirm_password &&
    form.value.password !== form.value.confirm_password
  ) {
    newErrors.confirm_password = "Passwords do not match.";
  }

  errors.value = newErrors;

  if (Object.keys(newErrors).length === 0) {
    const token = route.query.token;
    if (!token) {
      alert("Invalid or missing token.");
      return;
    }

    try {
      const response = await $fetch(
        `${config.public.API_BASE_URL}/api/auth/reset-password?token=${token}`,
        {
          method: "POST",
          body: {
            token,
            newPassword: form.value.password,
          },
        }
      );

      alert(response.message || "Password reset successful!");
      form.value = { password: "", confirm_password: "" };
      router.push("/login");
    } catch (err) {
      alert(
        err?.data?.message || "Reset failed. Token may be invalid or expired."
      );
    }
  }
}
</script>
