<template>
  <div>
    <nav class="navbar">
      <div class="logo">CFP</div>
      <div class="nav-links">
        <button @click="navigateTo('/login')">Login</button>
        <button @click="navigateTo('/signup')">Signup</button>
        <button @click="loginWithGitHub">Login with GitHub</button>
      </div>
    </nav>
  </div>
</template>

<script setup>
const navigateTo = (path) => {
  useRouter().push(path);
};
const loginWithGitHub = () => {
  window.location.href = "/api/auth/github";
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #1e293b;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links button {
  margin-left: 15px;
  padding: 8px 18px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-links button:hover {
  background-color: #2563eb;
}

.content {
  padding: 60px 40px;
  text-align: center;
}

.content h1 {
  font-size: 40px;
  margin-bottom: 10px;
}

.content p {
  font-size: 18px;
  color: #555;
}
</style>
