<template>
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

<style lang="less">
.card-container {
  width: 388px;
  background: #f2f6fa;
  border-radius: 20px;
  margin-right: 30px;
}

.smooth-dnd-container .vertical {
  margin: 0 21px 0 22px;
}

.card {
  background-color: white;
  border-radius: 20px;
  padding: 20px 23px 17px 17px;
  margin-bottom: 32px;
  cursor: move;
  .body {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    .description {
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 30px;
      color: #000000;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user {
      display: flex;
      align-items: center;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 100px;
      }
      .username {
        margin-left: 15px;
        width: 101px;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 30px;
        color: #000000;
      }
    }
    .date {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 30px;
      color: #999999;
    }
  }
}

.card-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 14px 39px 25px;
  cursor: move;
  .left {
    display: flex;
    .title {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-style: normal;
      font-weight: 500;
      font-size: 28px;
      line-height: 42px;
      color: #000000;
      max-width: 220px;
    }
    .badge {
      width: 40px;
      height: 40px;
      margin-left: 12px;
      background: #d2defb;
      border-radius: 100px;
      border: none;
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;
      color: #253251;
    }
  }
  .add-btn {
    width: 55px;
    height: 55px;
    background: #d2defb;
    box-shadow: 2px 2px 10px #d2defb;
    border-radius: 30px;
    border: none;
    color: #000000;
    font-size: 28px;
    cursor: pointer;
  }
}

.new-add-area {
  margin: 0 21px 0 22px;
  padding-bottom: 40px;
  form {
    background: #ffffff;
    border-radius: 20px;
    padding: 18px 19px 17px 17px;
    textarea {
      width: 309px;
      height: 109px;
      background: rgba(210, 222, 251, 0.12);
      border: 1px dashed rgba(210, 222, 251, 0.44);
      box-sizing: border-box;
      border-radius: 12px;
      padding: 15px;
      resize: none;
      outline: none;
    }
    textarea::placeholder {
      font-weight: 500;
      font-size: 11px;
      line-height: 16px;
      color: #d2defb;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
      .user {
        display: flex;
        align-items: center;
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 100px;
        }
        .username {
          margin-left: 15px;
          width: 101px;
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 30px;
          color: #000000;
        }
      }
      .actions {
        .add {
          width: 71px;
          height: 36px;
          background: #d2defb;
          box-shadow: 2px 2px 10px #d2defb;
          border-radius: 10px;
          margin-right: 18px;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 19px;
          color: #253251;
          border: none;
          cursor: pointer;
          transition: 0.18s ease;
          &:hover {
            font-weight: 600;
          }
        }
        .cancel {
          width: 47px;
          height: 20px;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 19px;
          color: #253251;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: 0.18s ease;
          &:hover {
            font-weight: 600;
          }
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

.column-drag-handle {
  cursor: move;
  padding: 5px;
}

.card-ghost {
  transition: transform 0.18s ease;
  transform: rotate(-10deg);
}

.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}

.drop-preview {
  border: 1px dashed #999999;
  box-sizing: border-box;
  border-radius: 20px;
  margin-bottom: 32px !important;
}

.cards-drop-preview {
  border: 1px dashed #999999;
  box-sizing: border-box;
  border-radius: 20px;
  margin-right: 30px !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.dropdown {
  display: inline-block;
  cursor: pointer;
  svg {
    margin-bottom: 5px;
    cursor: pointer;
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  padding: 18px 16px;
  z-index: 1;
  width: 54px;
  height: 59px;
  background: #FFFFFF;
  box-shadow: 5px 5px 15px rgba(37, 50, 81, 0.4);
  border-radius: 8px;
}

.dropdown:hover .dropdown-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  span {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #253251;
  }
}
</style>
