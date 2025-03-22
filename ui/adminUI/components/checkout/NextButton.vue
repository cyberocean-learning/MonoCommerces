<template>
	<div style="display: flex; padding: 7px 0px" >
		<v-btn
			v-if="returnBtn"
			color="primary"
			outlined
			style="text-transform: none;"
			@click="$router.back()"
		>
			<v-icon class="ml-1" left>mdi-arrow-left</v-icon>
			{{ $t('return') }}
		</v-btn>
		<v-spacer />
		<v-btn
			color="primary"
			style="text-transform: none;"
			@click="nextClick"
			:disabled="!enabledNextBtn"
		>
			{{ caption || $t('next') }}<v-icon class="ml-1" right>mdi-arrow-right</v-icon>
		</v-btn>
	</div>
</template>

<script>
export default {
	props: {
		nextClick: {
			required: true,
		},
		enabledNextBtn: {
			required: true,
		},
		caption: {
			default: null,
		},
		returnBtn: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<style>

</style>