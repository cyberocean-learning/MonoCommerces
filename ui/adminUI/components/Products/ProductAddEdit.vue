<template>
  <div>
    <!-- <v-btn @click="log(product)">Console.Log</v-btn> -->
    <template v-if="productPickerMode">
      <ProductTypePicker @selectedMode="mode = $event" />
    </template>
    <v-row v-if="mode == 'SIMPLE_PRODUCT'">
      <div class="xcol-md-8 main-section">
        <v-card>
          <TitleDescriptionFields
            ref="title_and_description"
            v-model="product"
          />
        </v-card>
        <v-card v-if="settings.products_enable_media_field?.value">
          <b>{{ $t("products.media") }}</b>
          <p></p>
          <!-- <SimpleFilesInput v-model="mediaFiles" /> -->
          <CLoader cpn="FilesInput" v-model="mediaFiles" />
        </v-card>
        <v-card v-if="enabled_pick_an_existing_variant && pickVariantCard">
          <div style="display: flex">
            <b>{{ $t("products.pick-an-existing-variant") }}</b>
            <v-spacer />
            <v-switch
              v-model="pickVariant"
              style="margin-top: 0px; height: 27px"
            ></v-switch>
            <!-- <v-btn @click="pickVariant" outlined color="primary" style="text-transform: none;">Pick</v-btn> -->
          </div>
          <VariantPopup
            v-if="pickVariant"
            v-model="defaultVariant"
            xCstyle="display: inline-block;width: 100%;"
            innerStyle="height: 100%;margin-top: 20px;border: 1px solid #cccccc;border-radius: 3px;padding: 5px;"
            :editMode="editMode"
            pickerOnly
          >
            <img
              :src="
                defaultVariant.image
                  ? defaultVariant.image.path
                  : '/placeholder.png'
              "
              style="
                padding: 2px;
                width: 90px;
                height: 90px;
                object-fit: cover;
                border: 1px solid #d4d4d4;
                border-radius: 3px;
                margin-right: 8px;
              "
            />
            <span style="display: inline-block; align-self: center">
              {{ defaultVariant.title }}
            </span>
            <v-spacer />
            <span
              v-if="defaultVariant.trackQuantity"
              style="
                font-size: 14px;
                text-align: right;
                padding-right: 5px;
                font-weight: 500;
                align-self: flex-end;
              "
            >
              {{ getters.shopCurrency }} {{ defaultVariant.price || "0.00" }}
              <br />
              {{ defaultVariant.quantity || "0" }}
              {{ $t("products.available-at-n-location-s", { n: 1 }) }}
            </span>
            <span
              v-else
              style="
                font-size: 14px;
                text-align: right;
                padding-right: 5px;
                font-weight: 500;
                align-self: flex-end;
              "
            >
              {{ getters.shopCurrency }} {{ defaultVariant.price || "0.00" }}
              <br />
              {{ $t("products.stocked-at-n-location-s", { n: 1 }) }}
            </span>
          </VariantPopup>
        </v-card>
        <v-card v-if="!pickVariant">
          <b>{{ $t("products.pricing") }}</b>
          <PricesFields
            v-model="defaultVariant"
            class="pt-6"
            ref="productPricing"
          />
        </v-card>
        <v-card v-if="!pickVariant && settings.products_enable_inventory_fields?.value">
          <b>{{ $t("products.inventory") }}</b>
          <InventoryFields
            v-model="defaultVariant"
            class="pt-6"
            ref="productInventory"
          />
        </v-card>
        <v-card v-if="!pickVariant && settings.products_enable_inventory_fields?.value && settings.products_enable_shipping_fields?.value">
          <b>{{ $t("products.shipping") }}</b>
          <ShippingFields
            v-model="defaultVariant.shipping"
            class="pt-6"
            ref="productShipping"
          />
        </v-card>
        <CLoader
          cpn="KhaField"
          v-if="settings.products_additional_attributes?.value"
          :schema="settings.products_additional_attributes?.value"
          v-model="product.additionalAttributes"
        />
      </div>
      <div class="xcol-md-4 side-section">
        <v-card v-if="user.role.key != 'vendor'">
          <ProductAvailability v-model="product" />
        </v-card>
        <v-card color="#f9fafb">
          <ProductOrganization v-model="product" @increaseLoading="increaseLoading" @decreaseLoading="decreaseLoading" />
        </v-card>
        <v-card v-if="settings.products_enable_video?.value" color="#f9fafb">
          <ProductYoutube v-model="product" />
        </v-card>
        <v-card v-if="settings.products_enable_specifications?.value" color="#f9fafb">
          <ProductSpecifications v-model="product" />
        </v-card>
        <CLoader 
          cpn="KhaField"
          v-if="settings.products_side_additional_attributes?.value"
          :schema="settings.products_side_additional_attributes?.value"
          v-model="product.sideAdditionalAttributes"
        />
      </div>
    </v-row>
    <v-row v-else-if="mode == 'VARIANTS_PRODUCT'">
      <div class="xcol-md-8 main-section">
        <v-card>
          <TitleDescriptionFields
            ref="title_and_description"
            v-model="product"
          />
        </v-card>
        <v-card>
          <b>{{ $t("products.media") }}</b>
          <p></p>
          <!-- <SimpleFilesInput v-model="mediaFiles" /> -->
          <CLoader cpn="FilesInput" v-model="mediaFiles" />
        </v-card>
        <!-- <v-card>
									<b>Pricing</b>
									<PricesFields v-model="product.variant" class="pt-6" ref="productPricing" />
							</v-card> -->
        <!-- <v-card>
									<b>Inventory</b>
									<InventoryFields v-model="product.variant" class="pt-6" ref="productInventory" />
							</v-card>
							<v-card>
									<b>Shipping</b>
									<ShippingFields v-model="product.variant" class="pt-6" ref="productShipping" />
							</v-card> -->
        <v-card>
          <b>{{ $t("products.shipping") }}</b>
          <ShippingFields
            :value="product.defaultShipping"
            @input="$set(product, 'defaultShipping', $event)"
            class="pt-6"
            ref="productShipping"
          />
        </v-card>
        <v-card>
          <b>{{ $t("products.variants") }}</b>
          <VariantsAdd
            v-model="product"
            class="pt-6"
            enabled
            ref="productVariants"
            :editMode="editMode"
          />
        </v-card>
      </div>
      <div class="xcol-md-4 side-section">
        <v-card>
          <ProductAvailability v-model="product" />
        </v-card>
        <v-card color="#f9fafb">
          <ProductOrganization v-model="product" @increaseLoading="increaseLoading" @decreaseLoading="decreaseLoading" />
        </v-card>
        <v-card color="#f9fafb">
          ProductYoutube
          <ProductYoutube v-model="product" />
        </v-card>
        <v-card color="#f9fafb">
          ProductSpecifications
          <ProductSpecifications v-model="product" />
        </v-card>
        <v-card v-if="settings.products_enable_video?.value" color="#f9fafb">
          <ProductYoutube v-model="product" />
        </v-card>
        <v-card v-if="settings.products_enable_specifications?.value" color="#f9fafb">
          <ProductSpecifications v-model="product" />
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
// import SimpleFilesInput from "@/components/Fields/SimpleFilesInput.vue";
import TitleDescriptionFields from "@/components/Products/TitleDescriptionFields.vue";
import ProductAvailability from "@/components/Products/ProductAvailability.vue";
import ProductOrganization from "@/components/Products/ProductOrganization.vue";
import ProductYoutube from "@/components/Products/ProductYoutube.vue";
import ProductSpecifications from "@/components/Products/ProductSpecifications.vue";
import ProductTypePicker from "@/components/Products/ProductTypePicker.vue";
import VariantsAdd from "@/components/Products/VariantsAdd.vue";

import PricesFields from "@/components/Variants/PricesFields.vue";
import ShippingFields from "@/components/Variants/ShippingFields.vue";
import InventoryFields from "@/components/Variants/InventoryFields.vue";
import VariantPopup from "@/components/Variants/VariantPopup.vue";

export default {
  props: {
    value: {
      required: true,
    },
    initalMode: {
      default: "",
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TitleDescriptionFields,
    PricesFields,
    InventoryFields,
    ShippingFields,
    VariantsAdd,
    ProductAvailability,
    ProductOrganization,
    ProductYoutube,
    ProductSpecifications,
    ProductTypePicker,
    VariantPopup,
    // SimpleFilesInput,
  },
  data() {
    return {
      mode: "",
      mediaFiles: [],
      defaultVariant: {
        id: this.get_uniqueid(),
        shipping: {},
      },
      // defaultVariant: {
      //     data: {},
      //     // data: this.variant_model(),
      // },
      // product: {
      // 	available: true,
      // },
      pickVariantCard: true,
      pickVariant: false,
      public: true,
      title: "",
      description: "",
      loadingCounter: 0,
    };
  },
  computed: {
    // product(){
    // 		return this.value ? this.value : {};
    // },
    isRtl(){
      return ["ar", "he", "fa", "ur", "yi", "sy", "ku", "az", "ps", "sd"].includes(this.$i18n.locale);
    },
    product: {
      get() {
        return this.value ? this.value : {};
      },
      set(val) {
        return this.$emit("input", val);
      },
    },
    loading(){
      if(this.loadingCounter > 0) return true;
      return false;
    },
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
    },
    productPickerMode() {
      return this.mode == "";
    },
		settings(){
			return this.shop.settings;
		},
    user() {
      return this.$store.state.auth.user;
    },
		enabled_pick_an_existing_variant(){
      if(this.settings.products_enabled_pick_an_existing_variant){
        return this.settings.products_enabled_pick_an_existing_variant?.value;
      }else{
        return true;
      }
    },
  },
  mounted() {
    this.mode = this.initalMode;
    console.log("this initalMode" , this.initalMode);
    
    if (this.mode == "SIMPLE_PRODUCT") {
      this.mediaFiles = this.product.images;
      this.defaultVariant = this.product.variant || {
        title: this.product.title,
        shipping: {},
      };
      if (this.editMode) {
        this.pickVariantCard = false;
      }
    }
    if (this.mode == "VARIANTS_PRODUCT") {
      this.mediaFiles = this.product.images;
    }
		// if(this.settings.products_enabled_variants_product && this.settings.products_enabled_grouped_product){
		// 	if(!this.settings.products_enabled_variants_product.value && !this.settings.products_enabled_grouped_product.value && !this.editMode){
		// 		this.mode = "SIMPLE_PRODUCT";
		// 	}
		// }
  },
  watch: {
    mediaFiles(val) {
      this.product.images = val;
      // if(!this.defaultVariant) = this.defaultVariant;
      if (this.defaultVariant) this.defaultVariant.image = val[0];
    },
    "product.title": {
      handler(val) {
        if (!this.pickVariant) {
          if (this.mode == "SIMPLE_PRODUCT") {
            this.defaultVariant.title = val;
          }
          // if (this.mode == "VARIANTS_PRODUCT") {
          // }
        }
      },
    },
    pickVariant(val) {
      if (val == false) {
        this.defaultVariant = {
          id: this.get_uniqueid(),
          shipping: {},
        };
      }
    },
    defaultVariant: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler(val) {
        this.product.variant = val;
      },
    },
    mode(val) {
      this.$emit("modeChange", val);
      this.product.type = val;
    },
  },
  methods: {
    log: console.log,
    validate() {
      return this.$refs.title_and_description.validate();
    },
    notAvailableNow() {
      this.$store.dispatch("set_notAvailableNow", true);
    },
    increaseLoading(){
      console.log("increaseLoading ++++++++++");
      this.loadingCounter++;
    },
    decreaseLoading(){
      console.log("decreaseLoading ++++++++++");
      this.loadingCounter--;
    },
  },
};
</script>

<style>
</style>