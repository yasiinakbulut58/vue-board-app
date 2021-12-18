/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "../types/board";

export const applyDrag = (
  arr: Card[] | any,
  dragResult: { removedIndex: number; addedIndex: number; payload: Card }
): Card[] | any => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
};

const cacheKey = "board-data";
export const getBoardData = (): string | null => {
  const storageData = localStorage.getItem(cacheKey);
  return storageData ? JSON.parse(storageData) : null;
};
export const setBoardData = (data: string): void =>
  localStorage.setItem(cacheKey, data);

export const data = {
  type: "container",
  children: [
    {
      id: "To-Do",
      type: "container",
      name: "To-Do",
      add: false,
      addValue: "",
      children: [
        {
          type: "draggable",
          id: 1,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 2,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 3,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
      ],
    },
    {
      id: "Doing",
      type: "container",
      name: "Doing",
      add: false,
      addValue: "",
      children: [
        {
          type: "draggable",
          id: 4,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Design Landing Page For Support Team",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 5,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description:
              "Design Landing Page For Support Team Design Landing Page For Support Team",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 6,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
      ],
    },
    {
      id: "Staging",
      type: "container",
      name: "Staging",
      add: false,
      addValue: "",
      children: [
        {
          type: "draggable",
          id: 7,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 8,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Design Landing Page For Support Team",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 9,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
      ],
    },
    {
      id: "Prod",
      type: "container",
      name: "Prod",
      add: false,
      addValue: "",
      children: [
        {
          type: "draggable",
          id: 10,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 11,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Task 1",
            avatar: "https://i.pravatar.cc/300",
          },
        },
        {
          type: "draggable",
          id: 12,
          data: {
            name: "Rober Pires",
            createTime: "Jan 21, 2020",
            description: "Design Landing Page For Support Team",
            avatar: "https://i.pravatar.cc/300",
          },
        },
      ],
    },
  ],
};
