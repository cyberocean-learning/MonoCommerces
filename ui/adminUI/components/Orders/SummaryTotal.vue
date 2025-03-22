<template>
	<div class="summary-total">
		<div v-if="summary.shippingFee" class="summary-wrapper">
			<span class="small-text">{{ $t('shipping-fee') }}</span>
			<v-spacer></v-spacer>
			<span class="small-price">{{summary.shippingFee}}</span>
		</div>
		<div v-if="showSubTotal" class="summary-wrapper">
			<span class="small-text">{{ $t('sub-total') }}</span>
			<v-spacer></v-spacer>
			<span class="small-price">{{summary.cart_total}}</span>
		</div>
		<div v-if="showSubTotal || summary.shippingFee" class="summary-devider"></div>
		<div class="summary-wrapper mt-3 mb-2">
			<span class="text">{{ $t('-total') }}</span>
			<v-spacer></v-spacer>
			<span class="price">{{summary.total}}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		summary: {
			required: true,
		},
	},
	computed: {
		showSubTotal(){
			return this.summary.cart_total && (this.summary.cart_total != this.summary.total);
		},
	},
}
</script>

<style>
.summary-total .summary-wrapper{
	display: flex;
}
.summary-total .summary-wrapper .text{
	font-size: 1.2em;
}
.summary-total .summary-wrapper .price{
	font-size: 1.5em;
}
.summary-total .summary-wrapper .small-text{
	font-size: 0.9em;
}
.summary-total .summary-wrapper .small-price{
	font-size: 1em;
}
.summary-devider{
	height: 1px;
	width: 100%;
	background-color: #e2e2e2;
	transform: translateY(5px);
}
</style>