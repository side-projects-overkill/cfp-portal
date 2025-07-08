<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/admin">Admin Dashboard</NuxtLink> |
        <NuxtLink to="/user">User Dashboard</NuxtLink> |
      </nav>
    </header>

    <main>
      <slot></slot>
    </main>

    <footer>
      <p>&copy; 2025 CFP Portal</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  background: #333;
  color: #fff;
  padding: 1rem;
}
nav a {
  color: #fff;
  margin-right: 1rem;
  text-decoration: none;
}
footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
}
</style>
