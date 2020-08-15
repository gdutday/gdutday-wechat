<template>
	<view class="flex-column" style="height: 100vh;">
		<view style="width: 750rpx;height: 1000rpx;" class="bg-white position-relative">
			<text class="cuIcon-back hg ml-3 pt-3 position-absolute " @tap.stop="back" :class="show ? '' : 'text-white'" style="z-index: 999999999;font-size: 20px;top:35rpx;"></text>
			<!-- cuIcon-locationfill -->
			<view
			    class="flex-column a-center j-center bg-white position-absolute depth-6"
			    style="width:40px;height:40px;border-radius:50%;z-index: 999999999;bottom: 45rpx; right: 20rpx;"
				@tap.stop="goToMyLocation"
				>    
				<image  
				class="position-absolute" 
				:src="loctionUrl" 
				style="width:30px;height:30px;"
				></image>
			    <!-- <text class="cuIcon-locationfill position-absolute " :class="showLocationButton ? '' : 'text-white'" style="z-index: 999999999;font-size: 30px;"></text> -->
			</view>
			<map style="width: 750rpx;height: 1000rpx;"
				id="map"
			    :scale="scale"
				layer-style="1"
				show-location="true"
				subkey="6ROBZ-HXOLX-L7M42-74U5S-7KFJJ-72F56"
				:latitude="latitude"
				:longitude="longitude"
				:markers = "markers"
				:polyline = "polyline"
			>
			<!-- show-location="true" -->
			</map>			
			<!-- subkey="6ROBZ-HXOLX-L7M42-74U5S-7KFJJ-72F56s" -->
		</view>
		<view class="position-relative" style="z-index: 20;">
			<xing-nav :shadow="true" :navItem="navStr" :index="i" @change="navChange" :color="$colorList.theme" :selectedColor="$colorList.white" />
		</view>
		<swiper @change="swiperChange" class="bg-white flex-1" :indicator-dots="false" circular :duration="500">
			<swiper-item v-for="(item, _index) in 3" :key="_index">
				<scroll-view scroll-y="true" class="all-1">
					<view
						@tap.stop="toDetail(nextItem)"
						class="ripple hg j-sb flex-row text-df animation-fade animation-3"
						v-for="(nextItem, nextIndex) in locationData[swiperList[_index]].items"
						:style="'animation-delay:'+ Math.log10(_index + 1) * 150 + 'ms'"
						:key="nextIndex"
					>
					<!-- class="ripple hg j-sb flex-row px-5 text-df animation-fade animation-3" -->
						<view  class="flex-row px-5">
							<view style="color:var(--commonButtonTip);width: 25px;">{{ nextIndex + 1 }}</view>
							<view >{{ nextItem.name }}</view>
						</view>
						<!-- <view @tap.stop="showLocation(nextItem.location)" class="capsul-button-2 text-white depth-3" :style="$themeBackground">介绍</view> -->
						<view @tap.stop="showLocation(nextItem.location)" class="capsul-button-2 text-white depth-3" :style="$themeBackground">导航</view>	

						<!-- <text @tap.stop="showLocation(nextItem.location)"></text> -->
						<!-- <text class="cuIcon-right"></text> -->
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import xingNav from '@/components/xing-nav.vue';
import xingSwiperComponent from '@/components/xing-swiper.js';
import { http } from '@/axios-config.js';
import {rePromise,getLocationListCom} from '@/commonFun.js';
const xingSwiper = xingSwiperComponent({
	length: 5
});
const QQMapWX = require('@/js_sdk/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js')
const qqmapsdk = new QQMapWX({
  key: '6ROBZ-HXOLX-L7M42-74U5S-7KFJJ-72F56'
});
export default {
	components: {
		xingNav
	},
	mixins: [xingSwiper],
	data() {
		return {
			show: true,
			showLocationButton: true,
			i: 0,
			tabDelay: null,
			locationData: [],
			longitude: '113.393122',        // 初始经度
			latitude: '23.039404',         // 初始纬度
			markers: [],
			scale: 17,
			mapContext: Object,
			qqmapsdk: qqmapsdk,
			polyline: [],
			loctionUrl: "/static/mylocation.png",
			// xingSwiper:xingSwiperComponent({length: 5}),
		};
	},
	created() {
		this.mapContext = uni.createMapContext("map",this);
	},
	computed: {
		scrollCenter() {
			return 'navitem' + this.center;
		},
		isLeft() {
			return this.i * 100.03;
		},
		navStr() {
			return this.locationData.map(item => item.type);
		},
	},
	mounted() {
		this.openInitLocation()
		this.getLocationList().then(res=>{
			this.locationData = res;
		})
	},
	methods: {
		back() {
			this.$Router.back(1);
		},
		load() {
			this.show = false;
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.i = this.swiperList[this.swiperCurrent];
		},
		navChange(e) {
			this.i = e.detail.index;
			this.refreshIndex(this.i);
		},
		async getLocationList() {
			const {
				data: { locationData }
			} = await rePromise({
				PromiseFunction: http.get.bind(http),
				parms: [
					"https://api.cerbur.top/functions/getLocationList",
				],
				times: 3,
			})
			return locationData;
		},
		toDetail(nextItem){
			console.log(nextItem.location)
			var lat = nextItem.location[0];
			var lng = nextItem.location[1];
			this.markers = [{
						iconPath: "/static/location.png",
						id: 0,
						latitude: lat,
						longitude: lng,
						width: 35,
						height: 35,
						// title: nextItem.name,
						callout: {
							content: nextItem.name,
							display: "ALWAYS",
						},
					}];
			this.mapContext.moveToLocation({
				latitude:lat,
				longitude:lng,
				success:function(res) {
					console.log(res)
				},
				fail: function (error) {
				  // console.error(error);
				},
			})
			
			// translateMarker
		},
		showLocation(location) {
			qqmapsdk.direction({
				mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
				//from参数不填默认当前地址
				to:"22.765282,112.96285",
				success: function (res) {
				// console.log(res);
				var ret = res;
				var coors = ret.result.routes[0].polyline, pl = [];
				//坐标解压（返回的点串坐标，通过前向差分进行压缩）
				var kr = 1000000;
				for (var i = 2; i < coors.length; i++) {
				  coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
				}
				//将解压后的坐标放入点串数组pl中
				for (var i = 0; i < coors.length; i += 2) {
				  pl.push({ latitude: coors[i], longitude: coors[i + 1] })
				}
				// console.log(pl)
				//设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
				this.latitude = pl[0].latitude,
				this.longitude = pl[0].longitude,
				this.polyline = [{
					points: pl,
					color: '#FF0000DD',
					width: 4
				  }];
				console.log(this.polyline)
				},
				fail: function (error) {
				// console.error(error);
				},
				complete: function (res) {
				// console.log(res);
				}
				});
		},
		openInitLocation() {
			var that = this
			uni.showModal({
				showCancel: false,
				title: "提示",
				content: "这个服务需要您打开位置，且给小程序位置权限以便给您提供优质的服务",
				success() {
					that.mapContext.moveToLocation();
				}
			});
		},
		goToMyLocation() {
			this.mapContext.moveToLocation();
		},
	},
	
	
	
	
	onShareAppMessage(res) {
		// 来自页面内转发按钮
		return {
			title: 'gdutday-校园导航分享给你',
			path: `/pages/map/map`
		};
	},
	onShareTimeline(){
		return {
			title: 'gdutday-校园导航分享给你',
			path: `/pages/map/map`
		}
	},
};
</script>

<style scoped lang="scss"></style>