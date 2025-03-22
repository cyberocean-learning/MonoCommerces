<template>
	<div class="payment-method">
		<div class="method-content" @click="selectPayment(method)">
			<v-checkbox
				color="success"
				:input-value="
					selectedPayment && selectedPayment.key == method.key
				"
			/>
			<span class="key">{{ $t("payment-methods."+method.key) }}</span>
			<!-- <span v-if="method.pricing.type == 'fixed'" class="price">{{
				method.pricing.price
			}}</span>
			<span v-else class="price-free">{{ $t('free') }}</span> -->
		</div>
		<div
			v-if="
				method.requireAddress &&
				selectedPayment &&
				selectedPayment.key == method.key
			"
			class="method-address"
		>
			<v-checkbox
				color="primary"
				v-model="paymentAddressLocal.useShippingAddress"
				:label="$t('use-shipping-address-as-a-billing-address')"
			/>
			<div v-if="!paymentAddressLocal.useShippingAddress">
				<h3>
					{{ $t('billing-address') }}
					<small v-if="paymentAddressError" style="color: red"
						>{{ $t('all-fields-are-required') }}</small
					>
				</h3>
				<v-text-field
					v-model="paymentAddressLocal.address"
					:label="$t('address')"
					:error="
						paymentAddressError && paymentAddressLocal.address.length < 3
					"
					:error-messages="
						paymentAddressError && paymentAddressLocal.address.length < 3
							? $t('required')
							: ''
					"
				/>
				<v-text-field
					v-model="paymentAddressLocal.zipCode"
					:label="$t('zip-code')"
					:error="
						paymentAddressError && paymentAddressLocal.zipCode.length < 3
					"
					:error-messages="
						paymentAddressError && paymentAddressLocal.zipCode.length < 3
							? $t('required')
							: ''
					"
				/>
				<v-text-field
					v-model="paymentAddressLocal.city"
					:label="$t('city')"
					:error="paymentAddressError && paymentAddressLocal.city.length < 3"
					:error-messages="
						paymentAddressError && paymentAddressLocal.city.length < 3
							? $t('required')
							: ''
					"
				/>
				<v-text-field
					v-model="paymentAddressLocal.phoneNumber"
					:label="$t('phone-number')"
					:error="
						paymentAddressError && paymentAddressLocal.phoneNumber.length < 6
					"
					:error-messages="
						paymentAddressError && paymentAddressLocal.phoneNumber.length < 6
							? $t('required')
							: ''
					"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			required: true,
		},
		shippingAddress: {
			required: true,
		},
		selectedPayment: {
			required: true,
		},
		selectPayment: {
			required: true,
		},
		paymentAddress: {
			required: true,
		},
		paymentAddressError: {
			required: true,
		},
	},
	data(){
		return {
		};
	},
	computed: {
		method: {
			get(){
				return this.value;
			},
			set(val){
				this.$emit("input", val);
			},
		},
		paymentAddressLocal: {
			get(){
				return this.paymentAddress;
			},
			set(val){
				this.$emit("update:paymentAddress", val);
			},
		},
	},
}
</script>

<style>
.payment-method .method-content {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin: 25px 0px;
  border-bottom: 1px solid #e2e2e2;
  padding: 0px 15px;
  padding-bottom: 10px;
  cursor: pointer;
}
.payment-method .method-content:hover {
  background-color: #f7f7f7;
}
.payment-method .method-address {
  border-left: 2px solid #e2e2e2;
  margin-left: 10px;
  padding-left: 10px;
}
.payment-method .method-content .price {
  font-weight: 500;
  font-size: 1em;
}
.payment-method .method-content .price-free {
  font-weight: 500;
  font-size: 1em;
  color: #3fbd00;
}
.payment-method .method-content .key {
  flex-grow: 1;
  font-size: 1em;
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>