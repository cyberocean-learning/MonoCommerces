<template>
	<div class="main-div">
		<HeaderLogo />

		<Part2Toggle :total="order.total" />
		<Part2>
			<ItemsList :items="order.items" />
			<SummaryTotal :summary="order" />
		</Part2>
		<Part1>
			<Breadcrumb step="payment" />
			<h3 style="font-weight: 500; margin: 25px 0px;">{{ $t("payment-method") }}</h3>
			<PaymentMethodEntry
				v-for="(method, index) in orders_payment_methods"
				v-model="orders_payment_methods[index]"
				:key="index"
				:selectedPayment="selectedPayment"
				:selectPayment="selectPayment"
				:paymentAddressError="paymentAddressError"
				:paymentAddress.sync="paymentAddress"
				:shippingAddress="shippingAddress"
			/>
			<NextButton :nextClick="nextClick" :enabledNextBtn="enabledNextBtn" returnBtn :caption="$t('review-order')" />
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
      loading: false,
      params: this.$route.params.path ? this.$route.params.path.split('/')[1] : '',
      order: {  // Added order object since it's used in template
        total: 0,
        items: [],
      },
      orders_payment_methods: [], // Added since it's used in v-for
      selectedPayment: {},
      paymentAddressError: null,
      paymentAddress: {
        useShippingAddress: true,
        address: "",
        zipCode: "",
        city: "",
        phoneNumber: "",
        user: {},
        data: {},
      },
      shippingAddress: {}, // Added since it's passed to PaymentMethodEntry
      enabledNextBtn: false,
    }
  },
  async mounted() {
    await this.asyncData();
  },
	computed: {
		order(){
			return this.$store.state.order;
		},
		orders_payment_methods(){
			return this.$store.state.data.orders_payment_methods;
		},
		shippingAddress(){
			return this.order.shipping.selectedShipping;
		},
	},
	methods: {
     async asyncData() {
		console.log("--------- Payment PAGE ----------");
		await this.$store.dispatch("startLoading");
    var order = await this.$store.dispatch("loadOrder", { id: this.params });
		var data = this.$store.state.data;
		await this.$store.dispatch("endLoading");
		if(order?.completed) this.$router.push("/"+this.params+"/review");


			this.loading = false ;
			this.// order ;
			this.selectedPayment = order?.payment?.selectedPayment ;
			this.paymentAddressError = null ;
			this.paymentAddress = order?.payment?.address ? JSON.parse(JSON.stringify(order?.payment?.address)) : {
				useShippingAddress: true,
        address: "",
        zipCode: "",
        city: "",
        phoneNumber: "",
				...(data.user ? (data.user.default_address || {}) : {}),
				data,
        };
			this.enabledNextBtn = !!order?.payment?.selectedPayment ;


  },
    async save() {
      this.loading = true;
			await this.$store.dispatch("updateOrder", {
				selectedPayment: this.selectedPayment,
				paymentAddress: this.paymentAddress,
			}).then((_) => {
      	this.loading = false;
			});
		},
    selectPayment(method) {
      this.selectedPayment = method;
      this.enabledNextBtn = true;
      this.loading = true;
			this.save();
    },
    async nextClick() {
			var error = false;
			if(
				this.selectedPayment &&
				this.selectedPayment.requireAddress &&
				!this.paymentAddress.useShippingAddress &&
				(this.paymentAddress.address.length < 3 ||
					this.paymentAddress.zipCode.length < 3 ||
					this.paymentAddress.city.length < 3 ||
					this.paymentAddress.phoneNumber.length < 6)
			) {
				error = true;
				this.paymentAddressError = true;
			}
			console.log("error");
			console.log(this.selectedPayment &&
				this.selectedPayment.requireAddress &&
				!this.selectedPayment.useShippingAddress);
			if(!error){
				this.loading = true;
				await this.save();
				await this.$store.dispatch("startLoading");
				// this.$router.push("/"+this.order.id+"/review");
			}
    },
	},
}
</script>

<style>

</style>