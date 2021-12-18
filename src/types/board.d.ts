export interface Board {
  type: string,
  children: Column[],
}

export interface Column {
  id: string,
  type: string,
  name: string,
  add: boolean,
  addValue: string,
  children: Card[]
}

export interface Card {
  type: string,
  id: number,
  data: {
    name: string,
    createTime: string,
    description: string,
    avatar: string,
  },
}

        