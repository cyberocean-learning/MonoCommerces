<template>
  <div :style="Cstyle">
    <v-dialog
      v-model="variantEditPopup"
      max-width="700"
      xcontent-class="dialog-is-at-the-top"
      scrollable
      :persistent="persistent"
    >
      <v-card>
        <v-card-title>
          <div style="display: flex; width: 100%">
            <span v-if="creationModeTitle">
              {{ creationModeTitle }}
            </span>
            <span v-else>
              {{ $t("products.edit-variant") }}
            </span>
            <v-spacer />
            <v-btn
              v-if="!creationMode"
              outlined
              color="secondary"
              style="text-transform: none"
              @click="pickVariantBtnClick"
            >
              {{ $t("products.pick-an-existing-variant") }}
            </v-btn>
          </div>
        </v-card-title>
        <v-divider style="margin: 0px"></v-divider>
        <v-card-text style="padding: 20px; padding-top: 0px">
          <div style="padding: 0px 25%">
            <!-- <CLoader
                    cpn="FilesInput"
										v-model="getValue.data.image"
										SingleFile
										Cstyle="margin-top: 10px;margin-bottom: 10px;"
									/> -->
            <CLoader
              cpn="FilesInput"
              :value="value.image"
              @input="update('image', $event)"
              SingleFile
              Cstyle="margin-top: 10px;margin-bottom: 10px;"
            />
			
          </div>
          <b>{{ $t("products.title") }}</b>
          <v-text-field
            :value="value.title"
            @input="update('title', $event)"
            outlined
            dense
            flat
            counter="250"
          />
          <b>{{ $t("products.pricing") }}</b>
          <!-- <PricesFields v-model="getValue" class="pt-6" ref="variantPricing" /> -->
          <PricesFields
            :value="value"
            @input="update(null, $event)"
            class="pt-6"
            ref="productPricing"
          />
          <v-divider></v-divider>

          <b>{{ $t("products.uppercase-inventory") }}</b>
          <!-- <InventoryFields v-model="getValue" :noOptions="noOptions" class="pt-6" ref="variantInventory" /> -->
          <InventoryFields
            :value="value"
            @input="update(null, $event)"
            :noOptions="noOptions"
            class="pt-6"
            ref="variantInventory"
          />
          <v-divider></v-divider>

          <b>{{ $t("products.shippment") }}</b>
          <!-- <ShippingFields v-model="getValue" weightOnly="true" class="pt-6" ref="productShipping" /> -->
          <ShippingFields
            :value="value.shipping"
            @input="update('shipping', $event)"
            class="pt-6"
            ref="productShipping"
            isVariant
          />
          <!-- <v-divider></v-divider> -->

          <!-- <b>SHIPPING</b>
                <ShippingFields class="pt-6" ref="variantShipping" /> -->
				 <div  class="row">
					<div class="col-6  justify-content-center">
						Product Qr Code : 
					</div>

					<div class="col-6">
				   <qr-code
					 :text="value.id"
					 size="120"
					 color="#536DFE"
					 error-level="H"
				   >
				   </qr-code>
				 </div>
					</div> 
					
        </v-card-text>
        <v-divider style="margin: 0px"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="showCancelBotton"
            @click="$emit('cancel')"
            color="primary"
            outlined
            style="text-transform: none"
            >{{ $t("common.cancel") }}</v-btn
          >
          <v-btn
            @click="
              closePopup();
              $emit('done');
            "
            color="primary"
            depressed
            style="text-transform: none"
            >{{ $t("products.done") }}</v-btn
          >
          <!-- <v-btn color="blue darken-1" text >Save</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="variantPickerPopup"
      max-width="700"
      scrollable
      :persistent="persistent"
    >
      <v-card>
        <v-card-title>
          <div style="display: flex; width: 100%">
            <span>
              {{ $t("products.pick-a-variant") }}
            </span>
            <v-spacer />
            <v-btn
              v-if="!pickerOnly"
              :outlined="!editMode"
              :depressed="editMode"
              color="secondary"
              style="text-transform: none"
              @click="createVariantBtnClick"
            >
              <v-icon v-if="editMode" class="mr-1">mdi-pen</v-icon>
              {{
                editMode
                  ? $t("products.edit-this-variant")
                  : $t("products.create-a-new-variant")
              }}
            </v-btn>
          </div>
        </v-card-title>
        <v-divider style="margin: 0px"></v-divider>
        <v-card-text class="variant-picker-popup" style="padding: 20px; padding-top: 0px">














          <CLoader
            cpn="CrudBrowse"
            shaped
            ref="browse"
            :loading="loading"
            XXtitle="$t('variants.browse-variants')"
            :newButtonCaption="$t('variants.new-variant')"
            :structure="structure"
            :items="variants"
            hideView
            hideEdit
            hideDelete
            rowClickable
            @rowClick="selectVariant"
            :searchable="true"
            :pagination="pagination"
            :emitSearchesInsteadOfDataTable="true"
            @newPagination="serverQuery($event)"
            @newSearch="serverQuery({ keyword: $event })"
            elevation="0"
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
              <div>
                <img
                  :src="item.image ? item.image.path : '/images/placeholder.png'"
                  class=""
                />
                <span v-if="item.id == (value || {}).id" class="item-selected-overlay"></span>
              </div>
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






          <!-- <div
            v-for="variant in variants"
            :key="variant.id"
            @click="selectVariant(variant)"
            :class="{
              'variant-picker-element': true,
              'variant-picker-selected-element': variant.id == value.id,
            }"
          >
            <img
              :src="variant.image ? variant.image.path : '/placeholder.png'"
            />
            <span style="display: inline-block; align-self: center">
              {{ variant.title }}
            </span>
            <v-spacer />
            <span
              v-if="variant.trackQuantity"
              style="
                font-size: 14px;
                text-align: right;
                padding-right: 5px;
                font-weight: 500;
              "
            >
              {{ getters.shopCurrency }} {{ variant.price || "0.00" }} <br />
              {{ variant.quantity || "0" }}
              {{ $t("products.available-at-n-location-s", { n: 1 }) }}
            </span>
            <span
              v-else
              style="
                font-size: 14px;
                text-align: right;
                padding-right: 5px;
                font-weight: 500;
              "
            >
              {{ getters.shopCurrency }} {{ variant.price || "0.00" }} <br />
              {{ $t("products.stocked-at-n-location-s", { n: 1 }) }}
            </span>
          </div> -->


















         
        </v-card-text>
        <!-- <v-divider style="margin: 0px"></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closePopup" color="primary" depressed style="text-transform: none;" >Done</v-btn>
            </v-card-actions> -->
      </v-card>
    </v-dialog>
    <div
      @click="showPopup"
      class="variant-popup-container"
      style="display: flex"
      :style="innerStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import PricesFields from "@/components/Variants/PricesFields.vue";
import InventoryFields from "@/components/Variants/InventoryFields.vue";
import ShippingFields from "@/components/Variants/ShippingFields.vue";
import { makeServerQuery } from "@/components/Helpers/Common";

export default {
  components: {
    PricesFields,
    InventoryFields,
    ShippingFields,
  },
  props: {
    value: "",
    
    editMode: {
      type: Boolean,
      default: false,
    },
    showCancelBotton: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    pickerOnly: {
      type: Boolean,
      default: false,
    },
    creationMode: {
      type: Boolean,
      default: false,
    },
    noOptions: {
      type: Boolean,
      default: false,
    },
    creationModeTitle: "",
    Cstyle: "",
    innerStyle: "",
  },
  data() {
    return {

      loading: false,
      variants: [],
			pagination: {},
      variants_first_load: false,

      variantEditPopup: false,
      variantPickerPopup: false,
      customVariant: true
    };
  },
  mounted() {
    this.customVariant = this.value?.id.includes("TMP_");
    if (this.pickerOnly) {
      this.pickVariantBtnClick();
      if(!this.variants_first_load){ // Load variants for the first time
        this.loadVariants();
        this.variants_first_load = true;
      }
    }
    if (this.creationMode) {
      this.variantEditPopup = true;
    }
  },
  computed: {
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
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
        }
      ];
    },
  },
  methods: {
		makeServerQuery: makeServerQuery,
		loadVariants(){
			this.serverQuery();
		},
		serverQuery(_params){

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
    update(key, val) {
      var obj;
      if (key) {
        obj = {
          ...this.value,
          [key]: val,
        };
      } else {
        obj = val;
      }
      this.$emit("input", obj);
    },
    selectVariant(variant) {
      console.log("variant +++++++++");
      console.log(variant);
      this.update(null, variant);
      if (this.pickerOnly) {
        this.variantPickerPopup = false;
      }
    },
    showPopup() {
      if (this.customVariant) {
        this.variantEditPopup = true;
      } else {
        this.variantPickerPopup = true;
      }
    },
    closePopup() {
      this.variantEditPopup = false;
      this.variantPickerPopup = false;
    },

    pickVariantBtnClick() {
      this.customVariant = false;
      this.variantEditPopup = false;
      this.variantPickerPopup = true;
      if(!this.variants_first_load){ // Load variants for the first time
        this.loadVariants();
        this.variants_first_load = true;
      }
    },
    createVariantBtnClick() {
      this.customVariant = true;
      this.variantEditPopup = true;
      this.variantPickerPopup = false;
    },
  },
  watch: {

  },
};
</script>

<style scoped>
.variant-popup-container:hover {
  cursor: pointer;
  background-color: #f3f3f3;
}

.variant-picker-selected-element {
  background-color: var(--v-secondary-lighten1);
  border-radius: 5px;
  color: white;
}

.variant-picker-selected-element:hover {
  background-color: var(--v-secondary-lighten2) !important;
}

.variant-picker-element {
  display: flex;
  margin: 10px -10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dedede;
  cursor: pointer;
  padding: 10px;
}

.variant-picker-element img {
  padding: 2px;
  width: 60px;
  background-color: white;
  height: 60px;
  object-fit: cover;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 3px;
  margin-right: 8px;
}

.variant-picker-element:hover {
  background-color: #f1f1f1;
}

.variant-picker-popup img {
  padding: 2px;
  width: 60px;
  background-color: white;
  height: 60px;
  object-fit: cover;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 3px;
  margin-right: 8px;
}

.variant-picker-popup .item-selected-overlay {
  background-color: #85858521;
  display: block;
  width: calc(100% - 26px);
  height: 67px;
  position: absolute;
  left: 0px;
  border-bottom: 5px solid var(--v-primary-base);
  border-left: 5px solid var(--v-primary-base);
  border-bottom-left-radius: 10px;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 7px;
  margin: 0px 13px;
  transform: translateY(-67px);
  pointer-events: none;
}

</style>