<template>
	<view v-if="isShow" :style="_time" style="position: fixed;color: #FFFFFF;" class=" tip tip-animation">{{ tip }}</view>
</template>
<script>
export default {
	data() {
		return {
			tip: '',
			isShowTip: true,
			hideTimer: null,
			noneTimer: null,
			isShow: false
		};
	},
	props: {
		time: {
			type: [String, Number],
			default: 3200
		}
	},
	computed: {
		_time() {
			return 'animation-duration:' + this.time + 'ms;';
		}
	},
	methods: {
		show(tip) {
			clearTimeout(this.noneTimer);
			this.isShow = false;
			this.$nextTick(() => {
				this.tip = tip;
				this.isShow = true;
				this.noneTimer = setTimeout(() => (this.isShow = false), parseInt(this.time));
			});
		}
	}
};
</script>
<style scoped lang="scss">
.tip {
	line-height: 50rpx;
	border-radius: 20rpx;
	padding: 0 20rpx;
	bottom: 45rpx;
	height: 50rpx;
	transform: translateX(calc(375rpx - 50%));
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0;
	background-color: #727272;
	z-index: 100000;
}
.tip-animation {
	animation-name: tipFade;
	animation-timing-function: ease-in-out;
}
@keyframes tipFade {
	0% {
		opacity: 0;
	}
	15% {
		opacity: 1;
	}
	85% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
</style>
