<template>
	<view>
		<cu-custom :isBack="true"><block slot="content">关于gdutday</block></cu-custom>
		<view style="border-radius: 5rpx;" class="w-650 box-border px-5 pb-5 bg-white shadow-warp rounded">
			<view class="h-130 text-gray text-lg">项目</view>
			<view class="p-content text-indent line-8" style="user-select: all;" v-for="(item, index) in introdution" :key="index">{{ item }}</view>
		</view>
		<view style="border-radius: 5rpx;margin-bottom: 30px;" class="w-650 box-border px-5 pb bg-white shadow-warp rounded">
			<view class="h-130 text-gray text-lg">二代目成员2020-今</view>
			<block v-for="(item, index) in team1" :key="index">
				<view class="flex-row j-sb a-center team my-4">
					<view class="flex-column j-around h-1">
						<view class="text-df flex-row">
							<view class="">{{ item.name }}</view>
							<view class="text-gray text-xs ml-1 flex-row flex-1 a-end" style="margin-bottom: 1px;">
								<view>{{ item.position }}</view>
							</view>
						</view>
						<view class="text-gray text-sm">{{ item.introdution }}</view>
					</view>
					<image class="head" :src="item.head"></image>
				</view>
			</block>
		</view>
		<view style="border-radius: 5rpx;margin-bottom: 30px;" class="w-650 box-border px-5 pb bg-white shadow-warp rounded">
			<view class="h-130 text-gray text-lg">特别合作</view>
			<block v-for="(item, index) in cooperation" :key="index">
				<view class="flex-row j-sb a-center team my-4">
					<view class="flex-column j-around h-1">
						<view class="text-df flex-row">
							<view class="">{{ item.name }}</view>
							<view class="text-gray text-xs ml-1 flex-row flex-1 a-end" style="margin-bottom: 1px;">
								<view>{{ item.position }}</view>
							</view>
						</view>
						<view class="text-gray text-sm">{{ item.introdution }}</view>
					</view>
					<image class="head" :src="item.head"></image>
				</view>
			</block>
		</view>
		<view style="border-radius: 5rpx;margin-bottom: 30px;" class="w-650 box-border px-5 pb bg-white shadow-warp rounded">
			<view class="h-130 text-gray text-lg">一代目成员2019-2020</view>
			<block v-for="(item, index) in team0" :key="index">
				<view class="flex-row j-sb a-center team my-4">
					<view class="flex-column j-around h-1">
						<view class="text-df flex-row">
							<view class="">{{ item.name }}</view>
							<view class="text-gray text-xs ml-1 flex-row flex-1 a-end" style="margin-bottom: 1px;">
								<view>{{ item.position }}</view>
							</view>
						</view>
						<view class="text-gray text-sm">{{ item.introdution }}</view>
					</view>
					<image class="head" :src="item.head"></image>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { introdution } from '@/staticData/staticData.js'
export default {
	data() {
		return introdution;
	},
	computed: {},
	methods: {}
};
</script>
<style scoped lang="scss">
.w-650 {
	width: 650rpx;
	margin: 25px auto 0px auto;
}
.h-130 {
	line-height: 50px;
}
.team {
	height: 60px;
}
.head {
	height: 60px;
	width: 60px;
}
</style>
