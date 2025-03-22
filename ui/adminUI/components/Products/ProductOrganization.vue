<template>
  <div>
    <div class="mb-2" style="font-size: 18px">
      <b>{{ $t("products.organization") }}</b>
    </div>
    <v-divider class="mb-4"></v-divider>
    <div v-if="$modules.isModuleLoaded('multi_vendors')">
      <b style="font-size: 13px">{{ $t("products.vendor") }}</b>
      <v-autocomplete
        :value="value.vendor"
        @input="update('vendor', $event)"
        :items="vendors"
        return-object
        item-value="id"
        item-text="name"
        :placeholder="$t('products.choose-a-vendor')"
        outlined
        dense
        :disabled="loading"
        :loading="loading"
      >
        <template v-slot:selection="{ item }">
          <div style="display: flex; align-items: center;">
            <img
              :src="item.image.path"
              style="width: 30px; margin-right: 5px"
            />
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-slot:item="{ item }">
          <div style="display: flex; align-items: center;">
            <img
              :src="item.image.path"
              style="width: 30px; margin-right: 5px"
            />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </v-autocomplete>
      <!-- <v-text-field :disabled="loading" :value="shop.defaultVendor" outlined dense/> -->
    	<v-divider class="mb-1"></v-divider>
    </div>
    <div class="">
      <b style="font-size: 13px">{{ $t("products.collections") }}</b>
    </div>
    <div class="pt-2">
      <v-autocomplete
        :value="value.collections"
        @input="update('collections', $event)"
        :items="collectionsWithTreeSort"
        return-object
        item-value="id"
        item-text="name"
        chips
        :placeholder="$t('products.search-for-collections')"
        outlined
        dense
        multiple
        :disabled="loading"
        :loading="loading"
      >
        <template v-slot:selection="{ item }">
          <div
            style="
              display: flex;
              align-items: center;
              padding: 1px 10px;
              border: 1px solid #808080;
              margin: 2px;
              border-radius: 10px;
            "
          >
            <img
              :src="item.image.path"
              style="width: 30px; margin-right: 5px"
            />
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-slot:item="{ item }">
          <div style="display: flex; align-items: center;" :style="item.parentId ? 'padding-left: 25px;' : ''">
            <img
              :src="item.image.path"
              style="width: 30px; margin-right: 5px"
            />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </v-autocomplete>
      <!-- <v-text-field prepend-inner-icon="mdi-magnify" placeholder="Search for collections" outlined dense/> -->
    	<v-divider class="mb-1"></v-divider>
    </div>
		<div>
			<div class="">
				<b style="font-size: 13px">{{ $t("products.tags") }}</b>
			</div>
			<div class="pt-2">
				<!-- <v-text-field placeholder="clothes, organic, Local" outlined dense/> -->
				<v-combobox
					:value="value.tags"
					@input="update('tags', $event)"
					:label="$t('products.tags-description')"
					multiple
					dense
					outlined
					chips
				></v-combobox>
			</div>
			<v-divider class="mb-1"></v-divider>
		</div>
  </div>
</template>

<script>
//TODO List Collections
//TODO Tags Creator
export default {
  props: {
    value: {
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      collections: [],
      vendors: [],
      // defaultVendor: {
      //   id: null,
      //   name: this.$store.getters.shopName,
      //   image: { path: this.$store.getters.logo },
      // },
    };
  },
  async mounted() {
    this.loading = true;
    this.$emit("increaseLoading");
    try {
      this.collections = await this.$dataCaller("get", "/api/all_collections");

		  // this.$modules.isModuleLoaded('projects')
      this.vendors = [
        // this.defaultVendor,
        ...(await this.$dataCaller("get", "/api/vendors")),
      ];
      if(this.vendors.length == 1){
        this.update('vendor', this.vendors[0]);
      }
    } catch (error) {
      console.error(error);
      this.$toast.error(
        this.$t("notifications.check-internet-and-refresh-the-page")
      );
    }
    this.loading = false;
    this.$emit("decreaseLoading");
  },
  computed: {
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
    },
    user() {
      return this.$store.state.auth.user;
    },
		collectionsWithTreeSort(){
      if(this.collections.length == 0) return [];
			const hashTable = Object.create(null);
			this.collections.forEach(collection => hashTable[collection.id] = {id: collection.id, order: collection.order, image: collection.image, title: collection.name, children: []});
			const dataTree = [];
			this.collections.forEach(collection => {
				if(collection.parentId && hashTable[collection.parentId]){
					// parent exists
					// parent empty just push
					// parent
					hashTable[collection.parentId].children.push(hashTable[collection.id]);
					hashTable[collection.parentId].children.sort( (a, b) => a.order - b.order );
				}
				else{
					dataTree.push(hashTable[collection.id]);
				}
			});
			dataTree.sort( (a, b) => a.order - b.order );
			var newIndexedDataTree = [];
			var setItem = (item) => {
				newIndexedDataTree.push(item.id);
				if((item.children || []).length > 0){
					var childs = item.children;
					childs.sort( (a, b) => a.order - b.order );
					// childs = childs.map(i => i.id);
					childs.forEach(setItem);
				}
			};
			dataTree.forEach(setItem);
			return newIndexedDataTree.map(id => this.collections.find(item => item.id == id));
		},
  },
  methods: {
    update(key, val) {
      var obj = {
        ...this.value,
        [key]: val,
      };
      this.$emit("input", obj);
    },
  },
};
</script>

<style>
</style>