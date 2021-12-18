<template>
  <button
    class="new-list"
    type="button"
    @click="
      $emit('onAddList', {
        id: `New-List-${Math.floor(Math.random() * 10000000)}`,
        type: 'container',
        name: 'New List',
        add: false,
        addValue: '',
        children: [],
      })
    "
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 10H10V17.5H7.5V10H0V7.5H7.5V0H10V7.5H17.5V10Z"
        fill="black"
      />
    </svg>
    Add New List
  </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NewList",
});
</script>
