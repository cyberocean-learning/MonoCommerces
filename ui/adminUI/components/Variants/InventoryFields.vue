<template>
  <div>
    <v-row>
      <v-col cols="6" style="padding-bottom: 0px; padding-top: 0px">
        <div class="mb-1" style="font-size: 14px; font-weight: 500;display: flex;width: 100%;">
          SKU ({{ $t("products.stock-keeping-unit") }})
        <v-spacer />
          <v-btn
            @click="generateNewSKU"
						:loading="generateNewSKULoading"
            x-small
            depressed
            color="secondary"
            style="font-weight: bold;"
          >
            <v-icon small left>mdi-cached</v-icon> SKU</v-btn
          >
        </div>
        <v-text-field
          :value="variant.sku"
          @input="update('sku', $event)"
          outlined
          dense
        />
      </v-col>
      <v-col cols="6" style="padding-bottom: 0px; padding-top: 0px">
        <div class="mb-1" style="font-size: 14px; font-weight: 500">
          {{ $t("products.barcode") }} (ISBN, UPC, GTIN,
          {{ $t("products.etc") }}.)
        </div>
        <v-text-field
          :value="variant.barcode"
          @input="update('barcode', $event)"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" style="padding-bottom: 0px; padding-top: 0px">
        <v-checkbox
          :input-value="variant.trackQuantity"
          @change="update('trackQuantity', $event)"
          :label="$t('products.track-quantity')"
          style="margin-top: 0px"
        />
        <v-checkbox
          :input-value="variant.continueOutOfStock"
          @change="update('continueOutOfStock', $event)"
          v-if="variant.trackQuantity"
          :label="$t('products.continue-selling-when-out-of-stock')"
          style="margin-top: 0px"
        />
      </v-col>
      <v-col
        v-if="variant.trackQuantity"
        cols="12"
        style="padding-bottom: 0px; padding-top: 0px"
      >
        <v-divider />
        <div class="">
          <b style="font-size: 13px">{{ $t("products.quantity") }}</b>

        </div>
      </v-col>
      <v-col
        v-if="variant.trackQuantity"
        cols="12"
        style="padding-bottom: 0px; padding-top: 20px"
      >
        <div style="display: flex">
          <b>{{ $t("products.location-name") }}</b> <v-spacer />
          <b>{{ $t("products.available") }}</b>
        </div>
        <v-divider />
        <div style="display: flex; align-items: center">
          <p>{{ defaultVendor }}</p>
          <v-spacer />
          <Number
            :value="variant.quantity"
            @input="update('quantity', $event)"
            :disabled="noOptions"
          />

          <div>
            number
            <CLoader
            cpn="Number"
            :value="variant.quantity"
            @input="update('quantity', $event)"
            :disabled="noOptions"
          ></CLoader>
          number
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Number from "@/components/Fields/Number.vue";

export default {
  components: {
    Number,
  },
  data() {
    return {
      generateNewSKULoading: false,
      // sku: null,
      // barcode: null,
      // trackQuantity: false,
      // continueOutOfStock: false,
      // quantity: 0
    };
  },
  props: {
    value: "",
    noOptions: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    variant() {
      return this.value == null ? {} : this.value;
    },
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
    },
    defaultVendor() {
      return this.$store.state.shop.defaultVendor;
    },
    // getValue(){
    //     return (this.value == null) ? {
    //         data: this.variant_model(),//this.$store.dispatch("models/variant_model"),
    //     } : this.value;
    // },
  },
  methods: {
    update(key, val) {
      var obj = {
        ...this.value,
        [key]: val,
      };
      this.$emit("input", obj);
    },
    async generateNewSKU() {
      this.generateNewSKULoading = true;
      var data = await this.$dataCaller("get", "/api/new-sku");
      if (data) {
        this.update("sku", data.sku);
      }
      this.generateNewSKULoading = false;
    },
    notAvailableNow() {
      this.$toast.warning(this.$t("notifications.not-available-now"));
      // this.$store.dispatch("set_notAvailableNow", true);
    },
  },
};
</script>

<style>
</style>