<template>
	<view @tap.stop="tap" style="padding: 5px;overflow: hidden;" class="ripple round" :data-value="value">
		<view class="radio round inner" :style="borderColor">
			<view :style="backgroundColor" :class="checked ? 'checked' : ''" class="radioRipple" />
		</view>
	</view>
</template>
<script>
export default {
	props: {
		checked: {
			type: Boolean,
			default: false
		},
		value: {
			type: String,
			default: ''
		},
		color:{
			type:String,
			default:'#0da7a5'
		}
	},
	computed:{
		borderColor(){
			return `border: 2px solid ${this.color} `;
		},
		backgroundColor(){
			return `background-color:${this.color}`;
		},
	},
	methods: {
		tap(e) {
			e.value = e.currentTarget.dataset.value;
			this.$emit('check', e);
		}
	}
};
</script>
<style scoped>
.inner {
	width: 22px;
	height: 22px;
}
.radioRipple {
	position: absolute;
	transition: all 0.15s ease;
	width: 11px;
	height: 11px;
	z-index: 500;
	transform: translate(-50%, -50%) scale(0);
	top: 50%;
	left: 50%;
	border-radius: 50%;
}
.radioRipple.checked {
	transform: translate(-50%, -50%) scale(1) !important;
}
</style>
