<template>
  <div class="pf-c-page">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="pf-c-page__main">
      <AdminTopbar />

      <section class="pf-c-page__main-section pf-m-light">
        <HeroStats />
      </section>

      <section class="pf-c-page__main-section">
        <h2 class="pf-c-title pf-m-lg">Manage Conferences</h2>
        <ConferenceTable />
      </section>

      <section class="pf-c-page__main-section">
        <h2 class="pf-c-title pf-m-lg">Review CFP Submissions</h2>
        <SubmissionsTable />
      </section>
    </div>
  </div>
</template>

<script setup>

</script>
