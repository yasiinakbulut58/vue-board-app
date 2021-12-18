<template>
  <div class="board">
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".card-column-header"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div class="card-container">
          <div class="card-column-header">
            <div class="left">
              <div class="title">
                {{ column.name }}
              </div>
              <button class="badge">{{ column.children.length }}</button>
            </div>
            <button class="add-btn" @click="column.add = !column.add">+</button>
          </div>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
              <Draggable v-for="(card, index) in column.children" :key="card.id">
                <div class="card">
                  <div class="body">
                    <span class="description">
                      {{ card.data.description }}
                    </span>
                    <div class="dropdown">
                      <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 1.46957 12.2107 0.96086 12.5858 0.585787C12.9609 0.210714 13.4696 0 14 0C14.5304 0 15.0391 0.210714 15.4142 0.585787C15.7893 0.96086 16 1.46957 16 2C16 2.53043 15.7893 3.03914 15.4142 3.41421C15.0391 3.78929 14.5304 4 14 4C13.4696 4 12.9609 3.78929 12.5858 3.41421C12.2107 3.03914 12 2.53043 12 2ZM6 2C6 1.46957 6.21071 0.96086 6.58579 0.585787C6.96086 0.210714 7.46957 0 8 0C8.53043 0 9.03914 0.210714 9.41421 0.585787C9.78929 0.96086 10 1.46957 10 2C10 2.53043 9.78929 3.03914 9.41421 3.41421C9.03914 3.78929 8.53043 4 8 4C7.46957 4 6.96086 3.78929 6.58579 3.41421C6.21071 3.03914 6 2.53043 6 2ZM0 2C0 1.46957 0.210714 0.96086 0.585786 0.585787C0.960859 0.210714 1.46957 0 2 0C2.53043 0 3.03914 0.210714 3.41421 0.585787C3.78929 0.96086 4 1.46957 4 2C4 2.53043 3.78929 3.03914 3.41421 3.41421C3.03914 3.78929 2.53043 4 2 4C1.46957 4 0.960859 3.78929 0.585786 3.41421C0.210714 3.03914 0 2.53043 0 2Z" fill="#999999"/>
                      </svg>
                      <div class="dropdown-content">
                        <span @click="column.children.splice(index,1)">Delete</span>
                        <span>Edit</span>
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <div class="user">
                      <img class="avatar" :src="card.data.avatar" alt="Avatar" />
                      <span class="username">{{ card.data.name }}</span>
                    </div>
                    <span class="date">{{ card.data.createTime }}</span>
                  </div>
                </div>
              </Draggable>
          </Container>
          <transition name="fade">
            <div class="new-add-area" v-if="column.add">
              <form>
                <textarea
                  v-model="column.addValue"
                  rows="3"
                  placeholder="New Task"
                  name="description"
                  autofocus
                ></textarea>
                <div class="footer">
                  <div class="user">
                    <img
                      class="avatar"
                      src="https://i.pravatar.cc/300"
                      alt="Avatar"
                    />
                    <span class="username">Rober Pires</span>
                  </div>
                  <div class="actions">
                    <button
                      type="button"
                      class="add"
                      @click="column.children.push({
                        type: column.type,
                        id: Math.floor(Math.random() * 10000000),
                        data: {
                          name: 'Rober Pires',
                          createTime: getCurrentDate(),
                          description: column.addValue,
                          avatar: 'https://i.pravatar.cc/300',
                        }}); column.addValue = '';"
                      :disabled="!column.addValue">Add</button>
                    <button type="button" class="cancel" @click="column.add = false">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script lang="ts">
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag, setBoardData } from "../utils/helper";
import { Board, Card, Column } from '../types/board'

import Vue from "vue";
import store from "@/store";

export default Vue.extend({
  name: "Cards",
  components: { Container, Draggable },
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
        return store.state.board as Board
      },
      set(value: Board) {
        store.state.board = value;
      }
    }
  },
  methods: {
    getCurrentDate() {
      return (new Date()).toLocaleDateString("en-US", { month: 'short', day: 'numeric',  year: 'numeric' })
    },
    onColumnDrop(dropResult: {
      removedIndex: number;
      addedIndex: number;
      payload: Card;
    }): void {
      const scene = Object.assign({}, this.scene);
      scene.children = applyDrag(scene.children, dropResult);
      this.scene = scene;
    },
    onCardDrop(columnId: string, dropResult: {
      removedIndex: number;
      addedIndex: number;
      payload: Card;
    }): void {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.scene);
        const column = scene.children.filter((p: Column) => p.id === columnId)[0] as Column;
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
    dragStart(): void {
      console.log("drag started");
    },
    log(params: Board): void {
      console.log(params);
    },
  },
  watch: {
    scene: function (val) {
      setBoardData(JSON.stringify(val));
    },
  }
});
</script>
