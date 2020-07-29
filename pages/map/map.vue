<template>
	<view class="flex-column" style="height: 100vh;">
		<view @tap="openImage" style="width: 750rpx;height: 750rpx;" class="bg-white position-relative">
			<image v-if="show" class="position-absolute all-1 gif-white response position-center" src="https://image.weilanwl.com/gif/rhomb-white.gif" mode="aspectFit"></image>
			<image @load="load" class="position-absolute all-1 animation-fade" :src="mapUrl" mode="">
				<text v-if="!show" class="text-white position-absolute position-center text-lg" style="top: 700rpx;">点击查看大图</text>
			</image>
			<text class="cuIcon-back hg ml-3 pt-4 position-absolute " @tap.stop="back" :class="show ? '' : 'text-white'" style="z-index: 20;font-size: 20px;"></text>
		</view>
		<view class="position-relative" style="z-index: 20;">
			<xing-nav :shadow="true" :navItem="navStr" :index="i" @change="navChange" :color="$colorList.theme" :selectedColor="$colorList.white" />
		</view>
		<swiper @change="swiperChange" class="bg-white flex-1" :indicator-dots="false" circular :duration="500">
			<swiper-item v-for="(item, _index) in 3" :key="_index">
				<scroll-view scroll-y="true" class="all-1">
					<view
						@tap="toDetail(nextItem)"
						class="ripple hg j-sb flex-row px-5 text-df animation-fade animation-3"
						v-for="(nextItem, nextIndex) in locationData[swiperList[_index]].items"
						:style="'animation-delay:'+ Math.log10(index + 1) * 150 + 'ms'"
						:key="nextIndex"
					>
						<view class="flex-row">
							<view style="color:var(--commonButtonTip);width: 25px;">{{ nextIndex + 1 }}</view>
							<view>{{ nextItem.name }}</view>
						</view>
						<text class="cuIcon-right"></text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import xingNav from '@/components/xing-nav.vue';
import xingSwiperComponent from '@/components/xing-swiper.js';
import { locationData } from '@/staticData/staticData.js';
const xingSwiper = xingSwiperComponent({
	length: locationData.length
});
export default {
	components: {
		xingNav
	},
	mixins: [xingSwiper],
	data() {
		return {
			show: true,
			i: 0,
			tabDelay: null,
			mapUrl: 'https://7869-xingxinglieo-tecft-1300484036.tcb.qcloud.la/map/map.jpg?sign=dfcf9a3ff0aff79e58281f777539f024&t=1575898494',
			locationData: locationData
		};
	},
	created() {},
	computed: {
		scrollCenter() {
			return 'navitem' + this.center;
		},
		isLeft() {
			return this.i * 100.03;
		},
		navStr() {
			return this.locationData.map(item => item.type);
		}
	},
	methods: {
		back() {
			this.$Router.back(1);
		},
		load() {
			this.show = false;
		},
		openImage() {
			this.$commonFun.becomePromise(uni.previewImage, { urls: [this.mapUrl] });
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.i = this.swiperList[this.swiperCurrent];
		},
		navChange(e) {
			this.i = e.detail.index;
			this.refreshIndex(this.i);
		}
	}
};
</script>

<style scoped></style>
