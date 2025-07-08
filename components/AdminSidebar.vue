<template>
  <aside class="pf-c-page__sidebar pf-m-dark">
    <nav class="pf-c-nav pf-m-dark">
      <ul class="pf-c-nav__list">
        <li class="pf-c-nav__item">
          <NuxtLink to="/admin/dashboard" class="pf-c-nav__link">Dashboard</NuxtLink>
        </li>
        <li class="pf-c-nav__item">
          <NuxtLink to="/admin/conferences" class="pf-c-nav__link">Conferences</NuxtLink>
        </li>
        <li class="pf-c-nav__item">
          <NuxtLink to="/admin/submissions" class="pf-c-nav__link">CFP Submissions</NuxtLink>
        </li>
        <li class="pf-c-nav__item">
          <NuxtLink to="/admin/settings" class="pf-c-nav__link">Settings</NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>