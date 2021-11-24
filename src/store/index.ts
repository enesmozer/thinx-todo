import Vue from "vue";
import Vuex from "vuex";
import { SET_ALL_TODOS } from "./constants";

Vue.use(Vuex);
const http = (url: string, method: string, data: Record<string, unknown>) => {
  const config: Record<string, unknown> = {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method,
  };
  if (method === "POST" || method === "PUT") {
    config.body = JSON.stringify(data);
  }

  return fetch(
    `https://crudcrud.com/api/4ca5a978721e469b961a3d98426a0ed7/${url}`,
    config
  ).then((response) => response.json());
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
      const res = await http("todos", "GET", {});
      commit(SET_ALL_TODOS, res);
      return res;
    },
    async addTodo({ dispatch }, data: Record<string, unknown>) {
      if (data["_id"]) {
        dispatch("edit", data);
      } else {
        const res = await http("todos", "POST", data);
        dispatch("fetchTodos");
        return res;
      }
    },
    async edit({ dispatch }, data: Record<string, unknown>) {
      const res = await http(`todos/${data["_id"]}`, "PUT", data);
      debugger;
      dispatch("fetchTodos");
      return res;
    },
    async delete({ dispatch }, id: string) {
      const res = await http(`todos/${id}`, "DELETE", {});
      dispatch("fetchTodos");
      return res;
    },
  },
});
