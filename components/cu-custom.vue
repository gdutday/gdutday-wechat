<template>
	<view class="position-relative">
			<view 
			class="text-white  w-1 flex-row a-center transition-5" 
			:class="(shadow ? 'depth-2 mb ' : '') + (fixed ? 'position-fixed' :'')" 
			style="top:0px;z-index:1000" 
			:style="style + (bgColor=== '' ? $themeBackground : bgColor )">
				<view class="back" @tap="BackPage">
					<text class="cuIcon-back" v-if="isBack"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{ top: StatusBar + 'px' }]"><slot name="content"></slot></view>
			</view>
			<!-- <view v-if="fixed" :style="style + $themeBackground" /> -->
			<view v-if="fixed" :style="style" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar
		};
	},
	name: 'cu-custom',
	computed: {
		style() {
			const {StatusBar,CustomBar} = this;
			return `height:${CustomBar}px;padding-top:${StatusBar}px;`;
		},
	},
	props: {
		isBack: {
			type: [Boolean, String],
			default: false
		},
		bgColor: {
			type: String,
			default: ''
		},
		shadow: {
			type: Boolean,
			default: true
		},
		fixed: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		BackPage() {
			if (this.isBack) {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
};
</script>

<style scoped>
.content {
	position: absolute;
	text-align: center;
	width: calc(100% - 340rpx);
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
	height: 60upx;
	font-size: 32upx;
	line-height: 60upx;
	cursor: none;
	pointer-events: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.back {
	font-size: 30rpx;
	margin-left: 30rpx;
}
</style>
