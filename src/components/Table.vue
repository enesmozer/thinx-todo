<template>
  <v-app class="mx-4 my-2 elevation-1">
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            newData ? "New Data" : "Update Data"
          }}</span>
        </v-card-title>
        <v-form @submit.prevent="save">
          <v-card-text>
            <v-container>
              <v-col>
                <v-row>
                  <v-text-field
                    v-model="currentData.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    type="text"
                    v-model="currentData.description"
                    label="description"
                  ></v-text-field>
                </v-row>
              </v-col>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showRemoveDialog">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="confirmDelete(selectedData)"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert text prominent v-if="error" type="error" icon="mdi-cloud-alert">
      {{ error }}
    </v-alert>
    <v-data-table
      :headers="headers"
      :items="allTodos"
      :items-per-page="5"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Data Table</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="openDialog">
            New Data
          </v-btn>
        </v-toolbar>

        <v-text-field
          class="mx-2"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="openDialog({ todo: item })">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteData(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import TodoType from "../types/todo";
import { mapActions, mapState } from "vuex";
export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Title", value: "name" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions" },
      ],
      search: "",
      showDialog: false,
      showRemoveDialog: false,
      selectedData: {},
      error: "",
      currentData: {
        _id: "",
        name: "",
        description: "",
      },
      newData: false,
    };
  },
  mounted() {
    this.fetchTodos();
  },
  computed: {
    ...mapState(["allTodos"]),
  },
  watch: {
    selectedData(val: TodoType) {
      this.newData = Object.keys(val).length === 0;
      this.currentData = { ...val } || {
        _id: "",
        name: "",
        description: "",
      };
    },
  },
  methods: {
    ...mapActions(["fetchTodos", "addTodo", "edit", "delete"]),
    submit(value: TodoType) {
      this.addTodo(value).then(() => {
        this.error = "";
        this.showDialog = false;
      });
    },

    update(value: TodoType) {
      this.edit(value).then(() => {
        this.error = "";
        this.showDialog = false;
      });
    },

    deleteData(todo: TodoType) {
      this.selectedData = todo;
      this.showRemoveDialog = true;
    },

    cancelDelete() {
      this.showRemoveDialog = false;
      this.selectedData = {};
    },

    confirmDelete(data: TodoType) {
      if (this.selectedData)
        this.delete(data["_id"]).then(() => {
          debugger;
          this.error = "";
          this.showRemoveDialog = false;
          this.selectedData = {};
        });
    },

    openDialog({ todo }: { todo?: TodoType }) {
      if (todo) {
        this.selectedData = todo;
      } else {
        this.selectedData = {};
      }

      this.showDialog = true;
    },

    close() {
      this.currentData = {
        _id: "",
        name: "",
        description: "",
      };
      this.showDialog = false;
    },
    save() {
      if (this.newData) this.submit(this.currentData);
      else this.update(this.currentData);
    },
  },
});
</script>
