<template>
  <transition name="fade">
    <div class="new-add-area" v-if="column.add">
      <form>
        <textarea
          v-model="column.addValue"
          rows="3"
          placeholder="New Task"
          ref="newTask"
          name="description"
        ></textarea>
        <div class="footer">
          <div class="user">
            <img class="avatar" src="https://i.pravatar.cc/300" alt="Avatar" />
            <span class="username">Rober Pires</span>
          </div>
          <div class="actions">
            <button
              type="button"
              class="add"
              @click="
                $emit('onAdd', {
                  type: column.type,
                  id: Math.floor(Math.random() * 10000000),
                  data: {
                    name: 'Rober Pires',
                    createTime: getCurrentDate(),
                    description: column.addValue,
                    avatar: 'https://i.pravatar.cc/300',
                  },
                })
              "
              :disabled="!column.addValue"
            >
              Add
            </button>
            <button type="button" class="cancel" @click="column.add = false">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </transition>
</template>

<script lang="ts">
import { Column } from "../types/board";

import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "NewTask",
  props: {
    column: Object as PropType<Column>,
  },
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
});
</script>
