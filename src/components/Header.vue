<template>
  <div class="card-column-header">
    <div class="left">
      <div class="title">
        {{ title }}
      </div>
      <button class="badge">{{ count }}</button>
    </div>
    <button class="add-btn" @click="$emit('onClick')">+</button>
  </div>
</template>

<script lang="ts">

import Vue from "vue";

export default Vue.extend({
  name: "Header",
  props: {
    title: String,
    count: Number,
  },
});
</script>
