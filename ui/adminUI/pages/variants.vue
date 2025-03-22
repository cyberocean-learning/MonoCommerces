<template>
  <div>
    <CLoader
      cpn="Breadcrumb"
      :title="$t('sidebar.organization.inventory')"
      :items="breadcrumb"
      class="mb-7 mt-3"
    >
      <template v-slot:homeIcon>
        <img src="/images/store.png" style="width: 17px; margin-bottom: -1px" />
      </template>
      <template v-slot:titleIcon>
        <img
          src="/images/inventory.png"
          style="width: 45px; margin-bottom: -10px"
        />
      </template>
    </CLoader>
    <CLoader
      cpn="Browse"
      shaped
      ref="browse"
      :loading="loading"
      XXtitle="$t('variants.browse-variants')"
      :newButtonCaption="$t('variants.new-variant')"
      :structure="structure"
      :items="variants"
      hideView
      rowClickable
      @newClick="newClick"
      @rowClick="showEditPopup"
      @updateClick="showEditPopup"
      @deleteClick="deleteVariant"
			showSelect
			:searchable="true"
			:pagination="pagination"
			:emitSearchesInsteadOfDataTable="true"
			@newPagination="serverQuery($event)"
			@newSearch="serverQuery({ keyword: $event })"
    >
			<template v-slot:headBeforeSpacer>
				<v-btn
					color="primary"
					fab
					icon
					class="ml-1"
					@click="loadVariants"
				>
					<v-icon size="25">
						mdi-sync
					</v-icon>
				</v-btn>
			</template>
      <template v-slot:item.image="{ item }">
        <img
          :src="item.image ? item.image.path : '/images/placeholder.png'"
          class="variant-inventory-thumbnail"
        />
      </template>
      <template v-slot:item.quantity="{ item }">
        <b v-if="item.trackQuantity">
          {{ item.quantity }}
        </b>
        <span v-else> {{ $t("products.untracked") }} </span>
      </template>
      <template v-slot:item.price="{ item }">
        <b>
          {{ item.formattedPrice }}
        </b>
      </template>
      <template v-slot:item.available="{ item }">
        <v-icon v-if="item.available" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="grey">mdi-eye-off</v-icon>
      </template>
    </CLoader>
    <VariantPopup
      v-if="addPopup"
      v-model="newVariant"
      persistent
      showCancelBotton
      @cancel="cancelAddPopup"
      @done="doneAddPopup"
      XXinnerStyle="height: 100%;margin-top: 20px;border: 1px solid #cccccc;border-radius: 3px;padding: 5px;"
      creationMode
      :creationModeTitle="$t('variants.new-variant')"
    >
    </VariantPopup>
    <VariantPopup
      v-if="editPopup"
      v-model="selectedVariant"
      persistent
      showCancelBotton
      @cancel="cancelEditPopup"
      @done="doneEditPopup"
      XXinnerStyle="height: 100%;margin-top: 20px;border: 1px solid #cccccc;border-radius: 3px;padding: 5px;"
      creationMode
    >
    </VariantPopup>
  </div>
</template>

<script>

import VariantPopup from "@/components/Variants/VariantPopup.vue";
import { makeServerQuery } from "@/components/Helpers/Common";

export default {
  components: {
    VariantPopup,
  },
  data() {
    // await ctx.store.dispatch("auth/waitUntilLoaded");
    return {
      loading: false,
      addPopup: false,
      editPopup: false,
      selectedVariant: null,
      newVariant: null,
      isMounted: false,
      variants: [],
			pagination: {},
    };
  },
  computed: {
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
    },
    breadcrumb() {
      return [
        {
          text: this.$t("sidebar.variants"),
          to: "/db_manager",
          disabled: false,
        },
      ];
    },
    structure() {
      return [
        {
          text: this.$t("variants.image"),
          value: "image",
          type: "text",
        },
        {
          text: this.$t("variants.title"),
          value: "title",
          type: "text",
        },
        {
          text: "SKU",
          value: "sku",
          type: "text",
        },
        {
          text: this.$t("variants.price"),
          value: "price",
          type: "text",
        },
        {
          text: this.$t("products.quantity"),
          value: "quantity",
          type: "text",
        },

        {
          text: this.$t("products.actions"),
          value: "actions",
          type: "actions",
        },
      ];
    },
  },
  mounted() {
    this.initNewVariant();
    this.isMounted = true;
		this.loadVariants();
  },
  methods: {
		makeServerQuery: makeServerQuery,
    initNewVariant() {
      this.newVariant = {
        id: this.get_uniqueid(),
        shipping: {},
      };
    },
		loadVariants(){
			this.serverQuery();
		},
		serverQuery(_params){
			// (keyword, sort_by_tag, sort_by_direction, page, page_size,)
			var params = {
				...(this.pagination || {}),
				...(_params || {}),
			};
			this.loading = true;
			this.$dataCaller("get", this.makeServerQuery("variants", params)).then((data) => {
				this.variants = data.items;
				this.pagination = data.pagination;
				this.loading = false;
			});
		},
    cancelAddPopup() {
      this.addPopup = false;
    },
    async doneAddPopup() {
      this.addPopup = false;
      await this.saveVariant(this.newVariant);
      this.initNewVariant();
			this.loadVariants();
    },
    cancelEditPopup() {
      this.editPopup = false;
    },
    async doneEditPopup() {
      this.editPopup = false;
      await this.saveVariant(this.selectedVariant);
			this.loadVariants();
    },
    async saveVariant(variant) {
      this.loading = true;
      try {
        await this.$store.dispatch(
          variant.id.includes("TMP_")
            ? "variants/save_variant"
            : "variants/edit_variant",
          variant
        );
        this.$toast.success(this.$t("notifications.variant-is-saved"));
        this.finished = true;
      } catch (error) {
        this.$toast.error(this.$t("notifications.variant-is-not-saved"));
      }

      this.loading = false;
    },
    newClick(db) {
      // this.$router.push("/variants/new");
      this.addPopup = true;
    },
    insertRequest(data) {
    },
    showEditPopup(variant) {
      this.selectedVariant = variant;
      this.editPopup = true;
    },
    async deleteVariant(variant) {
			try {
				await this.$store.dispatch("variants/delete_variant", variant);
				this.$toast.success(this.$t("notifications.variant-is-deleted"));
			  this.loadVariants();
			} catch (error) {
				this.$toast.error(this.$t("notifications.variant-is-not-deleted"));
			}
    },
  },
};
</script>

<style>
.variant-inventory-thumbnail {
  width: 40px;
  height: 40px;
  border: 1px solid #c1c1c1;
  border-radius: 4px;
  object-fit: cover;
  background-color: white;
  padding: 1px;
  margin-top: 5px;
}
</style>