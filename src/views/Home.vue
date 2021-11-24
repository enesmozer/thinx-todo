<template>
  <div>
    <Table />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Table from "../components/Table.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Table,
  },
});
</script>
