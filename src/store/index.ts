import Vue from "vue";
import Vuex from "vuex";
import { getBoardData, data } from "../utils/helper";
import { Board } from "../types/board";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    board: (getBoardData() as string) || (data as Board),
  },
  mutations: {},
  actions: {},
  modules: {},
});
