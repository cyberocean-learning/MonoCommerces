<template>
	<div>
		<CLoader cpn="Breadcrumb" :title="$t('sidebar.products')" :items="breadcrumb" class="mb-7 mt-3">
			<template v-slot:homeIcon>
				<img src="/images/store.png" style="width: 17px;margin-bottom: -1px;" />
			</template>
			<template v-slot:titleIcon>
					<svg xmlns="http://www.w3.org/2000/svg" style="filter: grayscale(0.9);margin-bottom: -10px;margin-right: 5px;" class="menu-item-img" width="40" height="40" xfill="#505050" fill="var(--v-primary-base)">
						<use xlink:href="/images/boxes.svg#SVG_ID" width="40" height="40" />
					</svg>
			</template>
		</CLoader >
		<CLoader
      cpn="Browse"
			shaped
			ref="browse"
			:loading="loading"
			Xtitle="$t('products.browse-products')"
			:newButtonCaption="$t('products.new-product')"
			:structure="structure"
			:items="filteredProducts"
			hideView
			rowClickable
			@newClick="newClick"
			xxviewClick="viewItem"
			:additionalHeaderSize="500"
			showSelect
			@rowClick="updateProduct"
			@updateClick="updateProduct"
			@deleteClick="deleteProduct"
			:searchable="true"
			:pagination="pagination"
			:emitSearchesInsteadOfDataTable="true"
			@newPagination="serverQuery($event)"
			@newSearch="serverQuery({ keyword: $event })"
			:isRtl="isRtl"
		>
			<template v-slot:headBeforeSpacer>
				<v-btn
					color="primary"
					fab
					icon
					:class="isRtl ? 'mr-1' : 'ml-1'"
					@click="loadProducts"
				>
					<v-icon size="25">
						mdi-sync
					</v-icon>
				</v-btn>
				<v-btn
					v-if="filterNonAvailable"
					outlined
					color="primary"
					class="mb-2"
					:class="isRtl ? 'mr-2' : 'ml-2'"
					style="text-transform: none;"
					small
					@click="filterNonAvailable = false"
				>
					<v-icon left>mdi-arrow-left-drop-circle</v-icon>
					{{$t("product.all-products")}}
				</v-btn>
				<v-btn
					v-if="!filterNonAvailable && (nonAvailableProducts?.length > 0)"
					outlined
					color="grey"
					class="mb-2"
					:class="isRtl ? 'mr-2' : 'ml-2'"
					style="text-transform: none;"
					small
					@click="filterNonAvailable = true"
				>
					{{$t("product.non-available-products")}}
					<span style="margin-left: 10px; background-color: grey; color: white; width: 50px; height: 28px; margin-right: -14px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 17px;">
						{{nonAvailableProducts?.length}}
					</span>
				</v-btn>
				  <span class="filter-entry-container">
          <span class="filter-entry-title">
            Filter:
            <v-icon>mdi-chevron-double-right</v-icon>
          </span>
          <v-select
            v-model="productFilter"
            :items="[
              { text: 'All', value: 'all' },
              { text: 'Without Mark', value: '' },
            ]"
            return-object
            single-line
            dense
          ></v-select>
        </span>
			</template>
			
			<template v-slot:item.vendor="{ item }">
				<span v-if="item.vendor && item.vendor.image" style="display: flex; margin: auto; align-items: center;flex-direction: column;width: fit-content;">
					<img
						:src="item.vendor.image.path"
						style="width: 35px;border: 2px solid grey;border-radius: 100%;"
					>
					<span style="font-size: 12px; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.vendor.name}}</span>
				</span>
				<span v-else>-</span>
			</template> 
			<template v-slot:item.image="{ item }">
				<img v-if="item.images" :src="(item.images?.length > 0) ? item.images[0].path : '/images/placeholder.png'" class="product-thumbnail" />
				<img v-else :src="item.image.path || '/images/placeholder.png'" class="product-thumbnail" />
			</template>
			<template v-slot:item.quantity="{ item }">
				<b v-if="item.variant.trackQuantity">
					{{ (item.type == "SIMPLE_PRODUCT") && item.variant ? item.variant.quantity : 'Multi-Variant' }}
				</b>
				<span v-else> {{$t('products.untracked')}} </span>
			</template>
			<template v-slot:item.price="{ item }">
				<b style="white-space: nowrap;">
					{{ item.price }}
				</b>
			</template>
			<!-- <template v-slot:item.price="{ item }">
				<b>
					{{ (item.type == "SIMPLE_PRODUCT") && item.variant ? priceFormatter(item.variant.price) : 'Multi-Variant' }}
				</b>
			</template> -->
			<template v-slot:item.available="{ item }">
				<v-icon v-if="item.available" color="success">mdi-check-circle</v-icon>
				<v-icon v-else color="grey">mdi-eye-off</v-icon>
			</template>
		</CLoader>
	</div>
</template>

<script>
import { makeServerQuery } from "@/components/Helpers/Common";

export default {
	
	data(){
		return {
			loading: false,
			firstLoad: true,
			filterNonAvailable: false,
			products: [],
			pagination: {},
			structure: [
				{
					text: this.$t('products.title'),
					value: "title",
					type: "text",
				},
				this.$modules.isModuleLoaded('multi_vendors') ? {
					text: "Vendor",
					value: "vendor",
					type: "text",
				} : null,
				{
					text: this.$t('products.image'),
					value: "image",
					type: "text",
				},
				{
					text: this.$t('products.price'),
					value: "price",
					type: "text",
				},
				{
					text: this.$t('products.on-sale'),
					value: "available",
					type: "text",
				},
				// {
				// 	text: "Created At",
				// 	value: "created_at",
				// 	type: "text",
				// 	readOnly: true,
				// },
				{
					text: this.$t('products.actions'),
					value: "actions",
					type: "actions",
				},
			].filter(h => !!h),
			productFilter: {
        text: "All",
        value: "all",
      },
		};
	},
  watch: {
    pagination: {
      handler(newVal) {
				const serializedPagination = encodeURIComponent(JSON.stringify(newVal));
				const newUrl = `${window.location.origin}${window.location.pathname}#pagination=${serializedPagination}`;
				history.replaceState(null, '', newUrl);
      },
      deep: true, // this is necessary to watch changes to object properties
    },
  },
	computed: {
    isRtl(){
      return ["ar", "he", "fa", "ur", "yi", "sy", "ku", "az", "ps", "sd"].includes(this.$i18n.locale);
    },
		filteredProducts(){
			if(this.filterNonAvailable){
				return this.nonAvailableProducts;
			}
			return this.products;
		},
		// products(){
		// 	return this.$store.state.products.products;
		// },
		nonAvailableProducts(){
			return this.$store.state["@PK"].products?.products?.filter(p => !p.available);
		},
		shop(){
			return this.$store.state.shop;
		},
		getters(){
			return this.$store.getters;
		},
		breadcrumb(){
			return [
				{
					text: this.$t('sidebar.products'),
					to: "/db_manager",
					disabled: false,
				},
			];
		},
		// structure(){
			
		// },
	},
	async mounted(){
		await this.loadProducts();
		$nuxt?.$pluginsBus?.$emit('module_products_index_ready', this);
		this.firstLoad = false;
    this.asyncData();
	},
	methods: {
    async asyncData(){
    let urlHash = window.location.hash;
    let paginationHash = urlHash.split('=')[1];
		var pagination = {};
    if (paginationHash) {
      try {
        pagination = JSON.parse(decodeURIComponent(paginationHash));
      } catch (e) {
        console.error('Failed to parse pagination from URL', e);
      }
    }
		return {
			pagination,
		};
	},
		makeServerQuery: makeServerQuery,
		// loadDatabases(){
		// 	this.loading = true;
		// 	this.$dataCaller("get", "/api/databases").then((data) => {
		// 	var dbs = [];
		// 	for(var db of data){
		// 		dbs.push({
		// 			name: db,
		// 		});
		// 	}
		// 	this.databases = dbs;
		// 	this.loading = false;
		// });
		// },
		async loadProducts(){
			await this.serverQuery();
		},
		newClick(db){
			this.$router.push("@PV/products/new");
		},
		insertRequest(data){
			// this.$dataCaller("post", "/api/databases", data).then((_) => {
			// 	this.loading = false;
			// 	this.loadDatabases();
			// });
		},
		async serverQuery(_params){
			// (keyword, sort_by_tag, sort_by_direction, page, page_size,)
			var params = {
				...(this.pagination || {}),
				...(_params || {}),
			};
			if(params.sort_by_tag == "price") params.sort_by_tag = "_price";
			this.loading = true;
			await this.$dataCaller("get", this.makeServerQuery("products", params)).then((data) => {
				this.products = data.items;
				this.pagination = data.pagination;
				this.loading = false;
			});
			if(!this.firstLoad) $nuxt?.$pluginsBus?.$emit('module_products_index_make_server_query', this);
		},
		updateProduct(product){
			this.$router.push("@PV/products/"+product.id);
		},
		async deleteProduct(product){
			try{
				await this.$store.dispatch('products/delete_product', product);
				this.$toast.success(this.$t('notifications.product-is-deleted'));
				this.loadProducts();
				// this.$router.push("/products");
			}catch(error){
				this.$toast.error(this.$t('notifications.product-is-not-deleted'));
			}
		},
	},
}
</script>

<style>
.product-thumbnail{
	width: 100px;
	height: 70px;
	border: 1px solid #c1c1c1;
	border-radius: 4px;
	object-fit: cover;
	background-color: white;
	padding: 1px;
	margin-top: 5px;
}
</style>