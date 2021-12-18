<template>
  <div class="board">
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".card-column-header"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div class="card-container">
          <Header
            :title="column.name"
            :count="column.children.length"
            @onClick="openForm(column, `form${column.id}`)"
          ></Header>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="(card, index) in column.children" :key="card.id">
              <Task
                :card="card"
                @onDelete="column.children.splice(index, 1)"
                @onUpdate="onUpdate($event, card)"
              ></Task>
            </Draggable>
          </Container>
          <NewTask
            :ref="`form${column.id}`"
            :column="column"
            @onCancel="column.add = false"
            @onAdd="
              onAdd($event, column.children);
              column.add = false;
            "
          ></NewTask>
        </div>
      </Draggable>
      <NewList @onAddList="onAddList($event, scene.children)"></NewList>
    </Container>
  </div>
</template>

<script lang="ts">
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag, setBoardData } from "../utils/helper";
import { Board, Card, Column } from "../types/board";
import Task from "./Task.vue";
import Header from "./Header.vue";
import NewTask from "./NewTask.vue";
import NewList from "./NewList.vue";

import Vue from "vue";
import store from "@/store";

export default Vue.extend({
  name: "Board",
  components: { Container, Draggable, Task, Header, NewTask, NewList },
  data() {
    return {
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
    };
  },
  computed: {
    scene: {
      get() {
        return store.state.board as Board;
      },
      set(value: Board) {
        store.state.board = value;
      },
    },
  },
  methods: {
    onColumnDrop(dropResult: {
      removedIndex: number;
      addedIndex: number;
      payload: Card;
    }): void {
      const scene = Object.assign({}, this.scene);
      scene.children = applyDrag(scene.children, dropResult);
      this.scene = scene;
    },
    onCardDrop(
      columnId: string,
      dropResult: {
        removedIndex: number;
        addedIndex: number;
        payload: Card;
      }
    ): void {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.scene);
        const column = scene.children.filter(
          (p: Column) => p.id === columnId
        )[0] as Column;
        const columnIndex = scene.children.indexOf(column);
        const newColumn = Object.assign({}, column);
        newColumn.children = applyDrag(newColumn.children, dropResult);
        scene.children.splice(columnIndex, 1, newColumn);
        this.scene = scene;
      }
    },
    getCardPayload(columnId: string) {
      return (
        index: number
      ): {
        type: string;
        id: number;
        data: {
          name: string;
          createTime: string;
          description: string;
          avatar: string;
        };
      } => {
        return this.scene.children.filter((p) => p.id === columnId)[0].children[
          index
        ];
      };
    },
    onUpdate(desc: string, card: Card): void {
      card.data.description = desc;
      setBoardData(JSON.stringify(this.scene));
    },
    onAdd(newTask: Card, tasks: Column): void {
      tasks.push(newTask);
    },
    onAddList(newList: Column, list: Board): void {
      list.push(newList);
    },
    openForm(column: Column, name: string): void {
      column.add = !column.add;
      this.$nextTick(() => {
        if (column.add) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const form = this.$refs[name] as any;
          if (form) {
            form[0].$refs.newTask.focus();
          }
        }
      });
    },
  },
  watch: {
    scene: function (val) {
      setBoardData(JSON.stringify(val));
    },
  },
});
</script>
