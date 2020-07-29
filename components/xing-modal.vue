<template>
	<view
		v-if="once || show"
		:style="_show"
		class="mask mask-fadeIn"
		:class="animationDelay ? 'mask-fadeOut' : ''"
		@tap="maskHide"
		@touchmove.stop.prevent="handle"
		@animationend="remove"
	>
		<view
			v-if="type == 'modal'"
			@tap.stop="handle"
			@animationend="afterShow"
			:style="round ? 'border-radius: 10rpx;' : ''"
			class="sc-dialog-content sc-dialog-fadeIn depth-8"
			:class="animationDelay ? 'sc-dialog-fadeOut' : ''"
		>
			<slot></slot>
		</view>
		<view v-if="type == 'bottomModal'" class="content content-fadeIn" :class="animationDelay ? 'content-fadeOut' : ''" @animationend="afterShow" @tap.stop="handle">
			<slot></slot>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			show: false,
			animationDelay: false
		};
	},
	props: {
		type: {
			type: String,
			default: 'modal'
		},
		once: {
			type: Boolean,
			default: false
		},
		maskForce:{
			type :Boolean,
			default:false
		},
		z: {
			type: Number,
			default: 9999
		},
		round:{
			type:Boolean,
			default:false
		}
	},
	computed: {
		_show() {
			if (this.once) return `${this.show ? '' : 'display:none'};z-index:${this.z};`;
			else return `z-index:${this.z};`;
		}
	},
	methods: {
		showModal(e) {
			this.show = true;
		},
		hideModal(e) {
			this.$emit('hide');
			this.animationDelay = true;
		},
		maskHide(){
			if(this.maskForce) return false;
			this.hideModal();
		},
		remove() {
			if (this.animationDelay) {
				this.show = false;
				this.$nextTick(() => {
					this.animationDelay = false;
				});
			}
		},
		afterShow(e) {
			if (this.show && !this.animationDelay) this.$emit('show');
		},
		handle() {}
	}
};
</script>

<style>
/* mask */
.mask {
	position: fixed;
	overflow: hidden;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.1);
}
.mask-fadeIn {
	will-change: transform;
	animation-name: maskFadeIn;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}
@keyframes maskFadeIn {
	from {
		opacity: 0;
		visibility: hidden;
	}
	to {
		opacity: 1;
		visibility: visible;
	}
}

.mask-fadeOut {
	will-change: transform;
	animation-name: maskFadeOut;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}

@keyframes maskFadeOut {
	from {
		opacity: 1;
		visibility: visible;
	}
	to {
		opacity: 0;
		visibility: hidden;
	}
}
/* modal */
.sc-dialog-content {
	position: fixed;
	box-sizing: border-box;
	overflow-y: auto;
	z-index: 10001;
	border-radius: 8rpx;
	/* width: 80vw; */
	max-height: 85%;
	/* margin: auto; */
	left: 50%;
	/* right: 0; */
	top: 50%;
	background-color: #f8f8f8;
	transform: scale(1) translate3d(-50%, -50%, 0);
	transform-origin: center;
}
.sc-dialog-fadeIn {
	will-change: transform;
	animation-name: dialogFadeIn;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}

@keyframes dialogFadeIn {
	from {
		opacity: 0;
		transform: translate3d(-50%, -50%, 0);
	}
	to {
		opacity: 1;
		transform:  translate3d(-50%, -50%, 0);
	}
}
.sc-dialog-fadeOut {
	will-change: transform;
	animation-name: dialogFadeOut;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}
@keyframes dialogFadeOut {
	from {
		opacity: 1;
		 transform:translate3d(-50%, -50%, 0);
	}
	to {
		opacity: 0;
		transform:  translate3d(-50%, -50%, 0);
	}
}
/* bottomModal */
.content {
	position: absolute;
	will-change: translate3d;
	width: 100%;
	bottom: 0px;
	padding-top: 40rpx;
	border-top-left-radius: 40rpx;
	border-top-right-radius: 40rpx;
	background-color: #ffffff;
}
.content-fadeIn {
	animation-name: bottom-dialogFadeIn;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}

@keyframes bottom-dialogFadeIn {
	from {
		transform: translate3d(0%, 100%, 0);
	}
	to {
		transform: translate3d(0%, 0%, 0);
	}
}
.content-fadeOut {
	will-change: transform;
	animation-name: bottom-dialogFadeOut;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: forwards;
}
@keyframes bottom-dialogFadeOut {
	from {
		transform: translate3d(0%, 0%, 0);
	}
	to {
		transform: translate3d(0%, 100%, 0);
	}
}
</style>
