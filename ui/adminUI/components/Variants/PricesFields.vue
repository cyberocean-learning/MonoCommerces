<template>
  <div>
    <v-row>
      <v-col cols="6" style="padding-bottom: 0px; padding-top: 0px">
        <div class="mb-1" style="font-size: 14px; font-weight: 500">
          {{ $t("product.price") }}
        </div>
        <v-text-field
          :value="variant.price >= 0 ? variant.price : 0"
          @input="update('price', Math.abs(parseFloat($event)))"
          placeholder="00.000"
          type="number"
          outlined
          :suffix="getters.shopCurrency"
          dense
          style="color: #5d5d5dde; font-weight: 400"
        />
      </v-col>
      <v-col cols="6" style="padding-bottom: 0px; padding-top: 0px">
        <div class="mb-1" style="font-size: 14px; font-weight: 500">
          {{ $t("product.compare-at-price") }}
        </div>
        <v-text-field
          :value="variant.compare_at_price >= 0 ? variant.compare_at_price : 0"
          @input="update('compare_at_price',  Math.abs(parseFloat($event)))"
          placeholder="00.000"
          type="number"
          outlined
          :suffix="getters.shopCurrency"
          dense
          style="color: #5d5d5dde; font-weight: 400"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    // value:{
    //     default: {
    //         price: null,
    //         comparePrice: null,
    //     }
    // },
  },
  computed: {
    variant() {
      return this.value == null ? {} : this.value;
    },
    // getValue(){
    //     return (this.value == null) ? {
    //         data: this.variant_model(),//this.$store.dispatch("models/variant_model"),
    //     } : this.value;
    // },
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
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
  // data(){
  //     return {
  //         price: this.value.price,
  //         comparePrice: this.value.comparePrice,
  //     };
  // },
  // watch: {
  //     price: {
  //         handler(val) {
  //             var res = {
  //                 price: this.price,
  //                 comparePrice: this.comparePrice,
  //             };
  //             this.$emit("input", res );
  //         },
  //     },
  // },
  // mounted(){
  //     this.price = this.value.price;
  //     this.comparePrice = this.value.comparePrice;
  // },
};
</script>

<style></style>
