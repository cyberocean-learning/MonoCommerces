<template>
    <div :value="step" tile :height="100" class="breadcrumb-wrap" >
			<span>
				<v-icon v-if="isStep('cart', 'check')" :color="isStep('cart', 'color')">{{isStep('cart', 'icon')}}</v-icon>
				<span :style="'transform: translateY(2px); display: inline-block;color: '+isStep('cart', 'color')">
				{{ $t('cart') }}
				</span>
			</span>

			<span class="divider">
				 <v-icon :color="isStep('cart', 'color')">mdi-chevron-right</v-icon>
			</span>

			<span>
				<v-icon v-if="isStep('information', 'check')" :color="isStep('information', 'color')">{{isStep('information', 'icon')}}</v-icon>
				<span :style="'transform: translateY(2px); display: inline-block;color: '+isStep('information', 'color')">
				{{ $t('information') }}
				</span>
			</span>

			<span class="divider">
				 <v-icon :color="isStep('information', 'color')">mdi-chevron-right</v-icon>
			</span>

			<span>
				<v-icon v-if="isStep('payment', 'check')" :color="isStep('payment', 'color')">{{isStep('payment', 'icon')}}</v-icon>
				<span :style="'transform: translateY(2px); display: inline-block;color: '+isStep('payment', 'color')">
				{{ $t('payment') }}
				</span>
			</span>

			<span class="divider">
				 <v-icon :color="isStep('payment', 'color')">mdi-chevron-right</v-icon>
			</span>

			<span>
				<v-icon v-if="isStep('review', 'check')" :color="isStep('review', 'color')">{{isStep('review', 'icon')}}</v-icon>
				<span :style="'transform: translateY(2px); display: inline-block;color: '+isStep('review', 'color')">
				{{ $t('review') }}
				</span>
			</span>
    </div>
</template>

<script>
export default {
	props: {
		step: {
			required: true,
		},
	},
	data(){
		return {
			steps: [
				"cart",
				"information",
				"payment",
				"review",
			],
		};
	},
	methods: {
		isStep(step, type){
			if(this.step == step){
				switch (type) {
					case "check": return true; break;
					case "color": return "#4374e7"; break;
					case "icon": return "mdi-pencil-circle"; break;
				}
			}else{
				if(this.steps.indexOf(step) < this.steps.indexOf(this.step)){
					switch (type) {
						case "check": return true; break;
						case "color": return "#2e8b00"; break;
						case "icon": return "mdi-check-circle-outline"; break;
					}
				}else{
					switch (type) {
						case "check": return true; break;
						case "color": return "#919191"; break;
						case "icon": return "mdi-circle-outline"; break;
					}
				}
			}
		},
	},
}
</script>

<style>
.breadcrumb-wrap{
	display: flex;
	justify-content: space-between;
	text-align: center;
	align-items: center;
	font-size: 1em;
}
.breadcrumb-wrap .divider{
	margin: 0px 0.5em;
}
</style>