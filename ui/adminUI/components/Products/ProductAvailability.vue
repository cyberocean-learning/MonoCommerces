<template>
	<div>
		<div>
			<b style="font-size: 18px;">{{$t('products.product-availability')}}</b>
			<v-btn
				@click="notAvailableNow"
					style="float: right;margin-top: -4px; margin-right: -4px; color: #2196F3;"
					small
					outlined>
					{{$t('products.manage')}}
			</v-btn>
		</div>
		<p style="font-size: 14px; color: #637381;">{{$t('products.available-on-1-of-1-channels-and-apps')}}</p>
		<v-divider></v-divider>
		<div style="display: flex;margin-top: 5px;">
			<p>{{$t('products.online-store')}}</p>
			<v-spacer/>
			<v-checkbox :input-value="product.available" @change="update('available', !!$event)" style="margin-top: -5px;" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
			"value": "",
	},
	computed: {
		product(){
				return (this.value == null) ? {} : this.value;
		},
		shop(){
			return this.$store.state.shop;
		},
		getters(){
			return this.$store.getters;
		},
	},
	mounted(){
		// console.log("variant.available");
		// console.log(this.variant.available);
	},
	methods: {
		update(key, val){
			var obj = {
				...this.value,
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