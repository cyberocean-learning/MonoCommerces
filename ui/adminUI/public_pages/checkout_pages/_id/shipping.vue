<template>
	<div v-if="!loading" class="main-div" >
		<HeaderLogo />

		<Part2Toggle :total="order?.total" />
		<Part2 :loading="loading">
			<ItemsList :items="order?.items" />
			<SummaryTotal :summary="order" />
		</Part2>
		<Part1>
			<Breadcrumb st:ep="information" />
			<h3 style="font-weight: 500; margin: 25px 0px;">{{ $t("shipping-method") }}</h3>
			<ShippingMethodEntry
				v-for="(method, index) in orders_shipping_methods"
				v-model="orders_shipping_methods[index]"
				:key="index"
				:selectedShipping="selectedShipping"
				:selectShipping="selectShipping"
				:shippingAddressError="shippingAddressError"
				:shippingPhoneNumberError="shippingPhoneNumberError"
				:shippingAddress.sync="shippingAddress"
				class="shipping-method"
			/>
			<NextButton :nextClick="nextClick" :enabledNextBtn="enabledNextBtn" />
		</Part1>
	</div>
</template>

<script>
import HeaderLogo from "@/components/checkout/HeaderLogo.vue";
import Part2Toggle from "@/components/checkout/Part2Toggle.vue";
import Part2 from "@/components/checkout/Part2.vue";
import ItemsList from "@/components/checkout/ItemsList.vue";
import SummaryTotal from "@/components/checkout/SummaryTotal.vue";
import Part1 from "@/components/checkout/Part1.vue";
import Breadcrumb from "@/components/checkout/Breadcrumb.vue";
import PaymentMethodEntry from "@/components/checkout/PaymentMethodEntry.vue";
import NextButton from "@/components/checkout/NextButton.vue";

export default {
    components: {
    HeaderLogo,
    Part2Toggle,
    Part2,
    ItemsList,
    SummaryTotal,
    Part1,
    Breadcrumb,
    PaymentMethodEntry,
    NextButton
  },
  data() {
     return {
      loading: true,
      selectedShipping: null,
      shippingAddressError: null,
      shippingPhoneNumberError: null,
      enabledNextBtn: false,
      shippingAddress: {
        address: "",
        zipCode: "",
        city: "",
        phoneNumber: "",
        data: null
      },
    }
  },
  async mounted() {
		console.log("orders_shipping_methods halo" , this.$store.state["@PK"].data?.orders_shipping_methods);
		console.log("data halo" , this.$store.state["@PK"].data);
		console.log("state halo" , this.$store.state["@PK"]);
		console.log("params" , this.params);

		
    await this.asyncData();
  },
	computed: {
		// orderitems(){
		// 	var arr = JSON.parse(JSON.stringify(this.order.items));
		// 	arr = arr.concat(arr);
		// 	arr = arr.concat(arr);
		// 	return arr;
		// },
		order(){
			return this.$store.state["@PK"]?.order;
		},
		orders_shipping_methods(){			
			return this.$store.state["@PK"]?.data?.orders_shipping_methods;
		},
	},
	methods: {
      async asyncData() {
		console.log("--------- Shipping PAGE ----------");
		await this.$store.dispatch("@PK/startLoading");
		// console.log("startLoading" , await this.$store.dispatch("startLoading"));
		
    await this.$store.dispatch("@PK/loadOrder", { id: this.params.id });
		var order = this.$store.state["@PK"]?.order;
		var data = this.$store.state["@PK"]?.data;
		console.log("data" , data);
		
		await this.$store.dispatch("@PK/endLoading");
		// if(order.completed) this.$router.push("/"+this.this.params.id+"/review");


			this.loading = false ;
			this.selectedShipping = order?.shipping.selectedShipping ;
			this.shippingAddressError = null ;
			this.shippingPhoneNumberError = null ;
			this.enabledNextBtn = !!order?.shipping.selectedShipping ;
      this.shippingAddress = order?.shipping.address ? JSON.parse(JSON.stringify(order?.shipping.address)) : {
        address: "",
        zipCode: "",
        city: "",
        phoneNumber: "",
				...(data?.user ? (data?.user?.default_address || {}) : {}),
				data,
      };
    },
    async save() {
      this.loading = true;
			await this.$store.dispatch("@PK/updateOrder", {
				selectedShipping: this.selectedShipping,
				shippingAddress: this.shippingAddress,
			}).then((_) => {
      	this.loading = false;
			});
		},
    selectShipping(method) {
      this.selectedShipping = method;
      this.enabledNextBtn = true;
      this.loading = true;
			this.save();
    },
    async nextClick() {
			var error = false;
			if(
				this.selectedShipping &&
				this.selectedShipping.requireAddress &&
				(this.shippingAddress.address.length < 3 ||
					this.shippingAddress.zipCode.length < 3 ||
					this.shippingAddress.city.length < 3 ||
					this.shippingAddress.phoneNumber.length < 6)
			) {
				error = true;
				this.shippingAddressError = true;
			}
			if(
				this.selectedShipping &&
				this.selectedShipping.requirePhoneNumber &&
				(this.shippingAddress.phoneNumber.length < 6)
			) {
				error = true;
				this.shippingPhoneNumberError = true;
			}
			if(!error){
				this.loading = true;
				await this.save();
				await this.$store.dispatch("@PK/startLoading");
				this.$router.push("/"+this.order?.id+"/payment");
			}
    },
	},
}
</script>

<style>

</style>