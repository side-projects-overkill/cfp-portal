<template>
  <table class="pf-c-table pf-m-grid-md">
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Smart ML Model</td>
        <td>Jane Doe</td>
        <td>Pending</td>
        <td>
          <pf-button class="pf-c-button pf-m-success">Accept</pf-button>
          <pf-button class="pf-c-button pf-m-danger">Reject</pf-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
// This component displays a table of CFP submissions with actions to accept or reject them.
import '@patternfly/elements/pf-table/pf-table.js';
import '@patternfly/elements/pf-button/pf-button.js';   
</script>
