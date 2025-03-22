<template>
  <div>
      <v-row>
					<v-col cols="12" style="padding-bottom: 0px;padding-top: 0px;">
							<v-checkbox
								:input-value="shipping.physicalProduct"
								@change="update('physicalProduct', $event)"
								:label="isVariant ? $t('products.use-custom-shippment') : $t('products.this-is-a-physical-product')"
								style="margin-top:0px;"
							/>
					</v-col>
					<v-col v-if="shipping.physicalProduct" cols="12" style="padding-bottom: 0px;padding-top: 0px;">
							<div class="mb-1" style="font-size: 14px; font-weight: 500;">{{$t('products.weight')}}</div>
									<v-text-field
											:value="shipping.weight"
											@input="update('weight', $event)"
											placeholder="00.00"
											outlined
											suffix="Kg"
											type="number"
											dense
											style="color: #5d5d5dde; font-weight: 400;width:150px;" />
          </v-col>

					<v-col v-if="shipping_per_product && shipping.physicalProduct" cols="12" style="padding-bottom: 0px;padding-top: 0px;">
							<v-divider v-if="!weightOnly" />
							<div class="" v-if="!weightOnly">
									<b style="font-size: 13px;">{{$t('products.shippment')}}</b>
									<v-btn
											@click="notAvailableNow"
											style="float: right;margin-top: 4px; margin-right: -4px; color: #2196F3;"
											small
											outlined>
											{{$t('products.manage-shippment-methods')}}
									</v-btn>
							</div>
          </v-col>
          <v-col v-if="shipping_per_product && shipping.physicalProduct && !weightOnly" cols="12" style="padding-bottom: 0px;padding-top: 20px;">
            <div style="display: flex;">
              <b>{{$t('products.shippment-methods')}}</b> <v-spacer/> <b>{{$t('products.available')}}</b>
            </div>
            <v-divider />
            <div style="display: flex;align-items: center;">
              <p>{{$t('products.home-delivery')}}</p>
              <v-spacer/>
              <v-checkbox :input-value="shipping.homeDelivery" @change="update('homeDelivery', $event)" />
            </div>
            <div style="display: flex;align-items: center;">
              <p>{{$t('products.pick-up-in-store')}}</p>
              <v-spacer/>
              <v-checkbox :input-value="shipping.PickUpInStore" @change="update('PickUpInStore', $event)" />
            </div>
          </v-col>
          <v-col v-if="shipping_per_product && !shipping.physicalProduct && !weightOnly" cols="12" style="padding-bottom: 0px;padding-top: 20px;">
              <p v-if="isVariant" style="color:grey;">{{$t('products.the-product-default-shippment-will-be-used-for-this-variant')}}</p>
              <p v-else style="color:grey;">{{$t('products.customers-wont-enter-their-shipping-address-or-choose-a-shipping-method-when-buying-this-product')}}</p>
          </v-col>
					
          <v-col v-if="shop.settings.variants_enabled_order_note?.value" cols="12" style="padding-bottom: 0px;padding-top: 20px;">
						<hr/>
						<v-checkbox :label="$t('products.use-note-for-this-product')" :input-value="shipping.noteEnabled" @change="update('noteEnabled', $event)" />
						<v-checkbox v-if="shipping.noteEnabled" :label="$t('products.use-multi-options-as-a-note-for-this-product')" :input-value="shipping.noteMultiOptionsEnabled" @change="update('noteMultiOptionsEnabled', $event)" />
						<div v-if="shipping.noteMultiOptionsEnabled">
              <CLoader cpn="NoteOptions" :value="shipping.noteOptions" @input="update('noteOptions', $event)" />
						</div>
          </v-col>
      </v-row>
  </div>
</template>

<script>
// import Number from "~/components/Fields/Number.vue";
// import NoteOptions from "~/components/Fields/NoteOptions.vue";
//TODO Load the shipping methods from the store
export default {
	components: {
		// Number,
		// NoteOptions,
	},
	props: {
		value: "",
		weightOnly: {
				default: false,
		},
		isVariant: {
			type: Boolean,
			default: false,
		},
	},
	data(){
		return {
			// physicalProduct: true,
			// weight: 0.0,
			// homeDelivery: true,
			// PickUpInStore: true,
		};
	},
	computed: {
		shipping(){
			return (this.value == null) ? {} : this.value;
		},
		shop(){
			return this.$store.state.shop;
		},
		shipping_per_product(){
			return (this.shop.settings.variants_shipping_per_product == null) ? false : this.shop.settings.variants_shipping_per_product?.value;
		},
		getters(){
			return this.$store.getters;
		},
		// store(){
		//     return this.$store.state.store;
		// },
		// getValue(){
		//     return (this.value == null) ? {
		//         data: this.variant_model(),//this.$store.dispatch("models/variant_model"),
		//     } : this.value;
		// },
	},
	methods: {
		update(key, val){
			var obj = {
				...(this.value || {}),
				[key]: val,
			};
			this.$emit("input", obj);
		},
			notAvailableNow(){
					this.$toast.warning(this.$t('notifications.not-available-now'));
					// this.$store.dispatch("set_notAvailableNow", true);
			},
	}
}
</script>

<style>

</style>