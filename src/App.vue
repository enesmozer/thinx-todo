<template>
  <v-app>
    <div class="home">
      <div class="title">Welcome to Todo List</div>
      <v-data-table :headers="headers" :items="allTodos" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{
                    editedItem.name ? "New Item" : "Edit Item"
                  }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.description"
                          label="Description"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </div></v-app
  >
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import { Vue } from "vue-property-decorator";
import { cloneDeep } from "lodash";
export default Vue.extend({
  name: "App",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
    },
    defaultItem: {
      name: "",
      description: "",
    },
  }),

  computed: {
    ...mapState(["allTodos"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["fetchTodos", "addTodo", "edit", "delete"]),
    initialize() {
      this.fetchTodos();
    },

    editItem(item: never) {
      this.editedItem = cloneDeep(item);
      this.dialog = true;
    },

    deleteItem(item: never) {
      debugger;
      this.delete(item["_id"]).finally(() => (this.dialogDelete = true));
      this.fetchTodos();
    },

    deleteItemConfirm() {
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem.name = "";
        this.editedItem.description = "";
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem.name = "";
        this.editedItem.description = "";
      });
    },

    save() {
      this.addTodo(this.editedItem).finally(() => this.close());
    },
  },
});
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem !important;
    margin-block: 2.5rem;
    height: 5rem;
  }
  .table {
    width: 75%;
  }
  .new-todo {
    position: absolute;
    right: 1rem;
    margin-block: 2rem;
  }
}
.form-card {
  padding: 3rem;
}
.v-data-table::v-deep th {
  font-size: 1.5rem !important;
}
.v-data-table::v-deep td {
  font-size: 1.3rem !important;
}
.v-data-footer::v-deep div {
  font-size: 1.1rem !important;
}
.notification {
  font-size: 2rem;
}
</style>
