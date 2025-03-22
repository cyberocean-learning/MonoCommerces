<template>
	<span class="part-2-toggle">
		<span @click="toggle" class="toggle-main">
			<v-icon left color="black">mdi-cart-variant</v-icon>
			<span v-if="hide" style="line-height: 1em;">{{ $t('show-order-summary') }}</span>
			<span v-else style="line-height: 1em;">{{ $t('hide-order-summary') }}</span>
			<v-icon v-if="hide" color="black">mdi-chevron-down</v-icon>
			<v-icon v-else color="black">mdi-chevron-up</v-icon>
			<v-spacer></v-spacer>
			<span style="white-space: nowrap;">{{total}}</span>
		</span>
		<style v-if="hide">
			@media (max-width: 999px) {
				.part-2{
					max-height: 0px;
					padding-top: 0px;
					padding-bottom: 0px;
					border-top: unset;
				}
			}
		</style>
	</span>
</template>

<script>
export default {
	props: {
		total: {
			required: true,
		},
	},
	data(){
		return {
			hide: true,
		};
	},
	methods: {
		toggle(){
			this.hide = !this.hide;
		},
	},
}
</script>

<style>

</style>