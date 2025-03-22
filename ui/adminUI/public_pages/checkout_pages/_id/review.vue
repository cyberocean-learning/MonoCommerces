<template>
	<div class="main-div">
		<HeaderLogo />

		<Part2Toggle :total="order.total" />
		<Part2>
			<ItemsList :items="order.items" />
			<SummaryTotal :summary="order" />
		</Part2>
		<Part1 class="review-order">
			<Breadcrumb step="review" class="mb-5" />
			<h3>{{ $t('review-order') }}</h3>
			<div class="rect-box">
				<ReviewData :order="order" :enableEditBtns="!completedOrder" />
			</div>
			<div class="rect-box">
				<SummaryTotal :summary="order" />
			</div>
			<NextButton
				:nextClick="nextClick"
				:enabledNextBtn="enabledNextBtn"
				:returnBtn="!completedOrder"
				:caption="order.payment.method.key == 'none' ? $t('complete-order') : $t('pay-now')"
			/>
		</Part1>
	</div>
</template>

<script>
export default {
    data() {
    return {
      params: this.$route.params.path ? this.$route.params.path.split('/')[1] : '',
      enabledNextBtn: true,
      completedOrder: false,
      selectedShipping: null,
      shippingAddress: null,
      selectedPayment: null,
      paymentAddress: null
    }
  },
  async mounted() {
   await this.asyncData();
  },
	computed: {
		order(){
			return this.$store.state.order;
		},
	},
	methods: {
     async asyncData() {
		console.log("--------- Review PAGE ----------");
		await this.$store.dispatch("startLoading");
    await this.$store.dispatch("loadOrder", { id: this.params });
		var order = this.$store.state.order;
		var data = this.$store.state.data;
		await this.$store.dispatch("endLoading");

			this.enabledNextBtn = true ;
			this.completedOrder = order.completed ;
			this.selectedShipping = order.shipping.selectedShipping ;
      this.shippingAddress = order.shipping.address ;
			this.selectedPayment = order.payment.selectedPayment ;
			this.paymentAddress = order.payment.address ;
  },
    nextClick() {
			// this.loading = true;
			// this.enabledNextBtn = false;
			this.$store.dispatch("startLoading");
			this.$store.dispatch("completeOrder").then((data) => {
				if(data == null){
					console.log("== null)");
					this.$store.dispatch("endLoading");
					alert(this.$t('error-while-submitting-order'));
					return null;
				}
				if(data.redirect){
					console.log("data.redirect)");
					if((data.redirect || "").toLowerCase().includes("https")){
						window.location = data.redirect;
					}else{
						this.$router.push(data.redirect);
					}
				}else if(data.completed){
					console.log("data.completed)");
					this.$store.dispatch("endLoading");
					this.$router.push("/"+this.$i18n.locale+"/completed#"+this.order.id);
				}
			});
    },
	},
}
</script>

<style>
.review-order h3{
	font-weight: 500;
}
.review-order .rect-box{
	margin: 10px;
	padding: 10px;
	border: 1px solid #cecdc8;
	border-radius: 7px;
	background-color: whitesmoke;
}
</style>