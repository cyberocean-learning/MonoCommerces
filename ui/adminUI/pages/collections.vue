<template>
  <div>
    <CLoader
      cpn="Breadcrumb"
      :title="$t('sidebar.collections')"
      :items="breadcrumb"
      class="mb-7 mt-3"
    >
      <template v-slot:homeIcon>
        <img src="/images/store.png" style="width: 17px; margin-bottom: -1px" />
      </template>
      <template v-slot:titleIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="
            filter: grayscale(0.9);
            margin-bottom: -10px;
            margin-right: 5px;
          "
          class="menu-item-img"
          width="40"
          height="40"
          xfill="#505050"
          fill="var(--v-primary-base)"
        >
          <use xlink:href="/images/layers.svg#SVG_ID" width="40" height="40" />
        </svg>
      </template>
    </CLoader>
    <!-- <div v-for="coll in collectionsWithTreeSort"> {{coll}} </div> -->
    <CLoader
      cpn="Crud"
      ref="crud"
      shaped
      xdialogType="dialog"
      noTitle
      :loading="loading"
      :singleName="$t('collections.single-name')"
      :pluralName="$t('collections.plural-name')"
      :structure="structure"
      :items="collectionsWithTreeSort"
      browseCustomView
      @browseViewClick="viewCollection"
      browseRowClickable
      xxpermanentPopups
      emptyOnNewItem
      :additionalHeaderSize="300"
      :defaultNewData="defaultNewData"
      @insertRequest="insertRequest"
      @updateRequest="updateRequest"
      @deleteRequest="deleteRequest"
      searchable
    >
      <template v-slot:browse.item.image="{ item }">
        <img
          :src="item.image ? item.image.path : '/images/placeholder.png'"
          class="collection-icon"
        />
      </template>
      <template v-slot:browse.item.cover="{ item }">
        <img
          :src="item.cover ? item.cover.path : '/images/placeholder.png'"
          class="collection-thumbnail"
        />
      </template>
      <template v-slot:browse.item.starred="{ item }">
        <v-icon v-if="item.starred" color="#ead300" size="30">mdi-star</v-icon>
        <v-icon v-else color="#e6e6e6" class="ml-1" size="20"
          >mdi-circle-outline</v-icon
        >
      </template>
      <template v-slot:browse.item.parent="{ item }">
        {{ item.parent ? item.parent.name : "-" }}
      </template>
      <template v-slot:headBeforeSpacer>
        <v-btn color="primary" fab icon class="ml-1" @click="loadCollections">
          <v-icon size="25"> mdi-sync </v-icon>
        </v-btn>
      </template>
      <template v-slot:headAfterSpacer>
        <v-dialog v-model="sortPopup" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              color="primary"
              style="text-transform: none"
              outlined
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              height="40"
            >
              <v-icon size="24" left> mdi-file-tree </v-icon>
              {{ $t("collections.sort-collections") }}
            </v-btn>
          </template>

          <v-card>
            <v-toolbar dark class="text-h5 lighten-1" color="primary">
              <v-icon size="30" left> mdi-file-tree </v-icon>
              {{ $t("collections.sort-collections") }}
            </v-toolbar>

            <v-card-text class="mt-4">
              <Tree
                :key="'tree-' + treeKey"
                :value="collectionsToTreeData"
                ref="tree_el"
              >
                <span
                  slot-scope="{ node, index, path, tree }"
                  class="collection-sorter-element"
                >
                  <b>{{ index }}</b>
                  <img
                    :src="node.image ? node.image.path : '/placeholder.png'"
                  />
                  <b>{{ node.title }}</b>
                </span>
              </Tree>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="saveSort"
                xoutlined
                style="text-transform: none"
              >
                {{ $t("common.save") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </CLoader>
  </div>
</template>

<script>
import "he-tree-vue/dist/he-tree-vue.css";
import { Tree, Draggable } from "he-tree-vue";

export default {
  components: {
    Tree: Tree.mixPlugins([Draggable]),
  },
  data() {
    return {
      loading: false,
      sortPopup: false,
      treeKey: 0,
      // items_collections: items_collections,
      collections: [],
    };
  },
  watch: {
    sortPopup(val) {
      if (!val) this.treeKey++;
    },
  },
  computed: {
    // collections(){
    // 	return this.$store.state.collections.collections;
    // },
    defaultNewData() {
      return {
        display: true,
      };
    },
    items_collections() {
      var items_collections = [];
      items_collections.push({
        text: "-",
        value: "-",
      });
      for (var collection of this.collections) {
        items_collections.push({
          text: collection.name,
          value: collection,
        });
      }
      return items_collections;
    },
    breadcrumb() {
      return [
        {
          text: this.$t("sidebar.collections"),
          to: "/collections",
          disabled: false,
        },
      ];
    },
    structure() {
      return [
        {
          text: "Id",
          value: "id",
          type: "hidden",
        },
        {
          text: this.$t("collections.starred"),
          value: "starred",
          type: "boolean",
        },
        {
          text: this.$t("collections.display"),
          value: "display",
          type: "boolean",
          hideBrowse: true,
        },
        {
          text: this.$t("collections.name"),
          value: "name",
          type: "text",
          rules: [
            this.$Jvalidator.rules.required(
              this.$t("products.title-is-required")
            ),
          ],
        },
        {
          text: this.$t("collections.key"),
          value: "key",
          type: "text",
          onValueChange: {
            key: "name",
            handler: (val, ctx, data, mode) => {
              if (mode == "edit") return;
              var convertToSlug = (Text) => {
                return Text.toLowerCase()
                  .replace(/ /g, "-")
                  .replace(/[^\w-]+/g, "");
              };
              ctx.$set(data, "key", convertToSlug(val));
              return convertToSlug(val);
            },
          },
        },
        {
          text: this.$t("collections.image"),
          value: "image",
          type: "image",
        },
        {
          text: this.$t("collections.cover"),
          value: "cover",
          type: "image",
        },
        {
          text: this.$t("collections.description"),
          value: "desc",
          type: "textarea",
          hideBrowse: true,
        },
        {
          text: this.$t("common.parent"),
          value: "parent",
          type: "select",
          typeData: {
            items: this.items_collections,
          },
        },
        {
          text: this.$t("common.actions"),
          value: "actions",
          type: "actions",
        },
      ];
    },
    collectionsToTreeData() {
      const treeKey = this.treeKey;
      const hashTable = Object.create(null);
      this.collections.forEach(
        (collection) =>
          (hashTable[collection.id] = {
            id: collection.id,
            order: collection.order,
            image: collection.image,
            title: collection.name,
            children: [],
          })
      );
      const dataTree = [];
      this.collections.forEach((collection) => {
        if (collection.parentId && hashTable[collection.parentId]) {
          // parent exists
          // parent empty just push
          // parent
          hashTable[collection.parentId].children.push(
            hashTable[collection.id]
          );
          hashTable[collection.parentId].children.sort(
            (a, b) => a.order - b.order
          );
        } else {
          dataTree.push(hashTable[collection.id]);
        }
      });
      dataTree.sort((a, b) => a.order - b.order);
      return dataTree;
    },
    collectionsWithTreeSort() {
      const hashTable = Object.create(null);
      this.collections.forEach(
        (collection) =>
          (hashTable[collection.id] = {
            id: collection.id,
            order: collection.order,
            image: collection.image,
            title: collection.name,
            children: [],
          })
      );
      const dataTree = [];
      this.collections.forEach((collection) => {
        if (collection.parentId && hashTable[collection.parentId]) {
          // parent exists
          // parent empty just push
          // parent
          hashTable[collection.parentId].children.push(
            hashTable[collection.id]
          );
          hashTable[collection.parentId].children.sort(
            (a, b) => a.order - b.order
          );
        } else {
          dataTree.push(hashTable[collection.id]);
        }
      });
      dataTree.sort((a, b) => a.order - b.order);
      var newIndexedDataTree = [];
      var setItem = (item) => {
        newIndexedDataTree.push(item.id);
        if ((item.children || []).length > 0) {
          var childs = item.children;
          childs.sort((a, b) => a.order - b.order);
          // childs = childs.map(i => i.id);
          childs.forEach(setItem);
        }
      };
      dataTree.forEach(setItem);
      return newIndexedDataTree.map((id) =>
        this.collections.find((item) => item.id == id)
      );
    },
  },
  async mounted() {
    await this.asyncData();
    await this.loadCollections();
  },
  methods: {
    async asyncData() {
      // var collections = await ctx.$dataCaller("get", "/api/collections");
      this.loading = false;
      this.sortPopup = false;
      this.treeKey = 0;
      this.collections = [];
    },
    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    loadCollections() {
      this.loading = true;
      this.$dataCaller("get", "/api/collections").then((data) => {
        this.collections = data;
        this.loading = false;
      });
    },
    viewCollection(db) {
      this.$refs.crud.cp.browse.openUpdatePanel(db);
    },
    async insertRequest(data) {
      // ----------------- Validate Form -----------------
      var error = false;
      if (this.collections.map((i) => i.key).includes(data.key)) {
        this.$toast.warning(this.$t("collections.key-name-already-exists"));
        error = true;
      }
      if (error) {
        await this.wait(50);
        this.$refs.crud.newInputsData = data;
        this.$refs.crud.browse.newClick();
        return;
      }

      // ----------------- Send Form -----------------
      this.$dataCaller("post", "@PA/api/collections", data).then((_) => {
        this.loading = false;
        this.loadCollections();
      });
    },
    async updateRequest(data) {
      // ----------------- Validate Form -----------------
      var error = false;
      if (
        this.collections
          .filter((c) => c.id != data.id)
          .map((i) => i.key)
          .includes(data.key)
      ) {
        this.$toast.warning(this.$t("collections.key-name-already-exists"));
        error = true;
      }
      if (error) {
        await this.wait(50);
        this.$refs.crud.browse.openUpdatePanel(data);
        return;
      }

      // ----------------- Send Form -----------------
      this.$dataCaller("put", "/api/collections/" + data.id, data).then((_) => {
        this.loading = false;
        this.loadCollections();
      });
    },
    deleteRequest(data) {
      this.$dataCaller("delete", "/api/collections/" + data.id).then((_) => {
        this.loading = false;
        this.loadCollections();
      });
    },
    saveSort() {
      this.loading = true;
      this.sortPopup = false;
      var data = this.$refs.tree_el.getPureTreeData();
      this.$dataCaller("put", "/api/sort_collections/", data).then((_) => {
        this.loading = false;
        this.loadCollections();
      });
    },
  },
};
</script>

<style>
.collection-thumbnail {
  width: 100px;
  height: 70px;
  border: 1px solid #c1c1c1;
  border-radius: 4px;
  object-fit: cover;
  background-color: white;
  padding: 1px;
  margin-top: 5px;
}

.collection-icon {
  width: 70px;
  height: 70px;
  border: 3px solid #c1c1c1;
  border-radius: 7px;
  object-fit: scale-down;
  background-color: #fff;
  padding: 11px;
  margin-top: 5px;
}

.collection-sorter-element {
  display: flex;
  /* margin: 10px -10px; */
  /* padding-bottom: 10px; */
  /* border-bottom: 1px solid #dedede; */
  cursor: pointer;
  /* padding: 10px; */
  align-items: center;
}

.collection-sorter-element img {
  padding: 2px;
  width: 35px;
  background-color: white;
  height: 35px;
  object-fit: cover;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 3px;
  margin-left: 5px;
  margin-right: 8px;
}

.tree-children .tree-placeholder {
  height: 52px !important;
}

.tree-children .tree-placeholder-node {
  height: 45px !important;
}

/* .tree-children .tree-placeholder-node-back{
	height: 40px !important;
} */
</style>
