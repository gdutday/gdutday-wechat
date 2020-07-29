<template>
	<view>
		<view class="w-1 flex-column depth-2 mb position-fixed" style="top:0px;z-index:1000" :style="style + color">
			<view class="w-1 flex-1 flex-row a-center text-white">
				<view class="back position-relative ml-3" style="z-index: 100;font-size: 15px;" @tap="BackPage"><text class="cuIcon-back"></text></view>
				<view class="text-df w-1 text-center position-absolute"><slot name="content"></slot></view>
			</view>
			<view class="bg-white px-3 py-1" style="height: 80rpx;">
				<view class="flex-row all-1" style="border-radius:10rpx;background-color:#F6F6F6;">
					<view class="flex-row a-center j-center h-1" style="width: 60rpx;"><text class="cuIcon-search text-df" style="color:black;height: 16px;width: 16px;" /></view>
					<input class="h-1 flex-1" :focus="focus" @focus="toFocus" @blur="blur" :value="value" :maxlength="maxlength" :placeholder="placeholder" @input="onInput" />
					<view v-if="cancel" class="flex-row a-center j-center h-1" @tap="Cancel" style="width: 60rpx;"><text class="cuIcon-close text-df" style="color:black;height: 16px;width: 16px;" /></view>
				</view>
			</view>
			<slot name="other"></slot>
		</view>
		<view :style="style"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		focus:{
			type:Boolean,
			default:false
		},
		value: {
			required: true
		},
		placeholder: {
			type: String, //框内提示
			default: ''
		},
		maxlength: {
			//最大长度
			type: [Number, String],
			default: 20
		},
		cancel:{
			type:Boolean,
			default:false
		}
	},
	model: {
		prop: 'value',
		event: 'input'
	},
	computed: {
		style() {
			const { StatusBar, CustomBar } = this,
				height = uni.upx2px(80);
			return `height:${CustomBar + height}px;padding-top:${StatusBar}px;`;
		},
		color() {
			return `background-color:${this.$colorList.theme};`;
		}
	},
	methods: {
		BackPage() {
			uni.navigateBack({
				delta: 1
			});
		},
		Cancel(){
			this.$emit('cancel');
		},
		toFocus() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isfocus = true;
				this.place_1 = this.placeholder;
			}, 50);
			this.$emit('focus');
		},
		blur() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isfocus = false;
				this.place_1 = '';
			}, 50);
			this.$emit('blur');
		},
		onInput(e) {
			//传出值
			this.$emit('change');
			this.$emit('input', e.target.value);
		}
	}
};
</script>

<style></style>
