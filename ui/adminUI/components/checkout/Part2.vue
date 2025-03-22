<template>
	<span class="part-2">
		<div class="content-div">
			<div v-show="loading" class="progress-wrap">
				<v-progress-circular color="gray" size="70" width="5" indeterminate />
				<!-- <span class="text1">{{ $t('loading') }}</span> -->
			</div>
			<slot></slot>
		</div>
	</span>
</template>

<script>
export default {
	props: {
		loading: {
			default: false,
		},
	},
}
</script>

<style>
.progress-wrap{
	position: absolute;
	z-index: 5;
	/* background-color: #0000002d; */
	left: 0px;
	top: 0px;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(3px);
}
</style>