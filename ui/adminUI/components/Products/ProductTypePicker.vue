<template>
	<div style="text-align: center; width: 100%; display: flex; flex-flow: wrap; justify-content: space-around;">
		<!-- Simple Product -->
		<div class="p-picker-element" @click="$emit('selectedMode', 'SIMPLE_PRODUCT')">
			<img :src="simpleProductImage" />
			<b>{{$t('products.simple-product')}}</b>
		</div>
		<!-- Multi variants product -->
		<div v-if="enabled_variants_product" class="p-picker-element" @click="$emit('selectedMode', 'VARIANTS_PRODUCT')">
			<img :src="variantsProductImage" />
			<b>{{$t('products.variants-product')}}</b>
		</div>
		<!-- Groupped product -->
		<div v-if="enabled_grouped_product" class="p-picker-element" @click="$emit('selectedMode', '')">
			<img :src="groupedProductImage" />
			<b>{{$t('products.grouped-product')}}</b>
		</div>
		<!-- External product -->
		<!-- Virtual Product -->
		<!-- One time Service -->
		<!-- Subscription Service -->
	</div>
</template>

<script>
export default {
	computed: {
			enabled_variants_product(){
				if(this.settings.products_enabled_variants_product){
					// return this.settings.products_enabled_variants_product.value;
					return true 
				}else{
					return true;
				}
			},
			// enabled_grouped_product(){
			// 	if(this.settings.products_enabled_grouped_product){
			// 		return this.settings.products_enabled_grouped_product.value;
			// 	}else{
			// 		return true;
			// 	}
			// },
			shop(){
				// console.log("store" , this.$store.state.shop);
					return this.$store.state.shop;
			},
			getters(){
				return this.$store.getters;
			},
			settings(){
				console.log("setting" ,this.shop.settings );
				
				return this.shop.settings;
			},
			simpleProductImage(){
				console.log("+++++++++++++++++++++++++++++++++");
				console.log(this.shop.settings);
				if(this.shop.settings.products_simple_product_image && this.shop.settings.products_simple_product_image?.value && this.shop.settings.products_simple_product_image?.value?.path){
					return this.shop.settings.products_simple_product_image?.value?.path;
				}else{
					return "/images/simple-product.png";
				}
			},
			variantsProductImage(){
				console.log("+++++++++++++++++++++++++++++++++");
				console.log(this.shop.settings);
				if(this.shop.settings.products_variants_product_image && this.shop.settings.products_variants_product_image?.value && this.shop.settings.products_variants_product_image?.value?.path){
					return this.shop.settings.products_variants_product_image?.value.path;
				}else{
					return "/images/variants-product.png";
				}
			},
			groupedProductImage(){
				console.log("+++++++++++++++++++++++++++++++++");
				console.log(this.shop.settings);
				if(this.shop.settings.products_grouped_product_image && this.shop.settings.products_grouped_product_image?.value && this.shop.settings.products_grouped_product_image?.value?.path){
					return this.shop.settings.products_grouped_product_image?.value?.path;
				}else{
					return "/images/grouped-product.png";
				}
			},
	},

}
</script>

<style>
.p-picker-element {
	min-width: 410px;
	display: flex;
	margin-bottom: 15px;
	border-right: 2px solid var(--v-primary-darken1);
	border-bottom: 2px solid var(--v-primary-darken1);
	border-radius: 20px;
	background-color: white;
	cursor: pointer;
	margin-top: 0px;
	transition: border-bottom 0.5s, margin-top 0.5s;
}
.p-picker-element img{
	width: 150px;
	height: 150px;
	border-radius: 20px;
	padding: 10px;
}
.p-picker-element b{
	display: flex;
	align-items: center;
	padding-left: 20px;
	padding-right: 10px;
	font-size: 25px;
	font-weight: 500;
	color: white;
	background-color: var(--v-primary-base);
	width: 100%;
	border-radius: 16px;
	border-left: 2px solid var(--v-primary-darken2);
	border-top-left-radius: 0px;
	border-bottom-left-radius: 100%;
	padding-bottom: 67px;
}
.p-picker-element:hover{
	border-bottom: 9px solid var(--v-primary-darken2);
	background-color: var(--v-primary-lighten4);
	margin-top: -7px;
}
.p-picker-element:hover img{
	/* filter: drop-shadow(10px 7px 15px black); */
}
</style>