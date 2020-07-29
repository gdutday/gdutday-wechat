<template>
	<view class="bg-white px-3 py-2 pb-4" style="width: 700rpx">
		<view class="title text-lg ">设置重复</view>
		<radio-group class="block flex-row j-around pt-1">
			<view class="flex-row a-center">
				<xing-radio :color="$colorList.theme" :checked="isDay" @check="RadioChange" value="day"></xing-radio>
				<text class="ml-1">每日</text>
			</view>
			<view class="flex-row a-center">
				<xing-radio :color="$colorList.theme"  :checked="!isDay" @check="RadioChange" value="week"></xing-radio>
				<text class="ml-1">每周</text>
			</view>
		</radio-group>
		<view class="pt-2 pb-1">
			<view class="flex-row j-sb checkDay " :class="isDay ? 'hide' : ''">
				<view
					@tap="checkDay(index)"
					v-for="(item, index) in weekDay"
					class="box-border flex a-center j-center transition-3"
					:class="item.checked ? 'text-white ' : 'ripple'"
					style="height: 30px;width: 30px;border-radius: 50%;"
					:style="item.checked ? $themeBackground + '' : 'border:1px solid #F4F4F4 '"
					:key="index"
				>
					{{ item.day }}
				</view>
			</view>
		</view>
		<view class="flex-row j-around w-1 a-center text-df pb-1 pt-5">
			<view class="flex-row a-center ">
				<text>重复</text>
				<input
					v-if="isDay"
					v-model="input.day"
					style="width: 70rpx;height: 60rpx;background-color: var(--commonButton);border-radius: 10rpx;"
					:style="$themeFont"
					class="d-inline-block text-center mx-2 "
					maxlength="2"
					type="text"
				/>
				<input v-else v-model="input.week" :style="$themeFont" class="d-inline-block text-center mx-2 capsul-input" maxlength="2" type="text" />
				<text>{{ isDay ? '天' : '周' }}</text>
			</view>
			<view :style="$themeFont" class="mr-3">确定</view>
		</view>
	</view>
</template>

<script>
//	import from '@/'
export default {
	inject: ['Bus'],
	//		components:{},
	data() {
		return {
			radio: 'day',
			input: {
				day: 7,
				week: 4
			},
			weekDay: [
				{ day: '一', checked: false },
				{ day: '二', checked: false },
				{ day: '三', checked: false },
				{ day: '四', checked: false },
				{ day: '五', checked: false },
				{ day: '六', checked: false },
				{ day: '日', checked: false }
			]
		};
	},
	computed: {
		isDay() {
			return this.radio == 'day';
		}
	},
	methods: {
		checkDay(e) {
			this.weekDay[e].checked = !this.weekDay[e].checked;
		},
		RadioChange(e) {
			this.radio = e.value;
		}
	}
};
</script>
<style scoped lang="scss">
.checkDay {
	opacity: 1;
	height: 30px;
	transition: all 0.25s ease-in-out;
	overflow: hidden;
	will-change: height;
}
.checkDay.hide {
	opacity: 0;
	height: 0px;
}
</style>
