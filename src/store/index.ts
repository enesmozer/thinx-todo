import Vue from "vue";
import Vuex from "vuex";
import { SET_ALL_TODOS } from "./constants";
import TodoType from "../types/todo";

Vue.use(Vuex);
// apiId only valid for few hours, replace it
// with the acquired ID from https://crudcrud.com/
const apiId = "37fc43ccd39d449b8c6fe07b5a06ca2b";
const http = async (url: string, method: string, data?: TodoType) => {
  const config: Record<string, unknown> = {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method,
  };
  if (method === "POST" || method === "PUT") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(
    `https://crudcrud.com/api/${apiId}/${url}`,
    config
  );
  return await response.json();
};
export default new Vuex.Store({
  state: {
    allTodos: [],
    isDialogOpen: false,
  },
  mutations: {
    [SET_ALL_TODOS](state, allTodos) {
      state.allTodos = allTodos;
    },
  },
  actions: {
    async fetchTodos({ commit }) {
      const res = await http("todos", "GET");
      commit(SET_ALL_TODOS, res);
      return res;
    },
    async addTodo({ dispatch }, data: TodoType) {
      if (data["_id"]) {
        dispatch("edit", data);
      } else {
        const res = await http("todos", "POST", data);
        dispatch("fetchTodos");
        return res;
      }
    },
    async edit({ dispatch }, data: TodoType) {
      const res = await http(`todos/${data["_id"]}`, "PUT", data);
      debugger;
      dispatch("fetchTodos");
      return res;
    },
    async delete({ dispatch }, id: string) {
      const res = await http(`todos/${id}`, "DELETE");
      debugger;
      dispatch("fetchTodos");
      return res;
    },
  },
});
