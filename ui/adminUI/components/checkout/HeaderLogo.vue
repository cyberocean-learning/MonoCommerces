<template>
	<div class="header-logo">
		<img
			:src="store?.logo ? store?.logo.path : brand?.logo"
		/>
		<span
			class="header-name"
			>{{ store?.name || brand?.name }}</span
		>
	</div>
</template>

<script>
export default {
	computed: {
		brand(){
			return this.$store.state.data?.brand;
		},
		store(){
			return this.$store.state.data?.store || {};
		},
	},
}
</script>

<style>
</style>