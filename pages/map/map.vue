<template>
	<view class="flex-column" style="height: 100vh;">
		<view style="width: 750rpx;height: 1000rpx;" class="bg-white position-relative">
			<text class="cuIcon-back hg ml-3 pt-3 position-absolute " @tap.stop="back" v-show="showBack" style="z-index: 999999999;font-size: 20px;top:35rpx;"></text>
			<text class="cuIcon-home hg ml-3 pt-3 position-absolute " @tap.stop="home" v-show="showHome" style="z-index: 999999999;font-size: 20px;top:35rpx;"></text>
			<view
			    class="flex-column a-center j-center bg-white position-absolute depth-6 active-shadow"
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
			</map>
		</view>
		<view class="position-relative" style="z-index: 20;">
			<xing-nav :shadow="true" :navItem="navStr" :index="i" @change="navChange" :color="$colorList.theme" :selectedColor="$colorList.white" />
		</view>
		<swiper @change="swiperChange" class="bg-white flex-1" :indicator-dots="false" circular :duration="500">
			<swiper-item v-for="(item, _index) in 3" :key="_index">
				<scroll-view scroll-y="true" class="all-1">
					<view
						@tap.stop="showLocation(nextItem)"
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
						<view
							class="flex-row"
						>
							<view @tap.stop="toDetail(nextItem)" class="capsul-button-2 text-white depth-3" :style="$themeBackground">介绍</view>
							<view @tap.stop="showNavigation(nextItem)" class="capsul-button-2 text-white depth-3 active-shadow" :style="$themeBackground">导航</view>	
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import Vue from "vue";
import xingNav from '@/components/xing-nav.vue';
import xingSwiperComponent from '@/components/xing-swiper.js';
import {rePromise,getLocationList} from '@/commonFun.js';
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
			showBack: true,
			showHome: false,
			showLocationButton: true,
			i: 0,
			tabDelay: null,
			locationData: [],
			longitude: '113.393122',        // 初始经度
			latitude: '23.039404',         // 初始纬度
			markers: [],
			scale: 17,
			polyline: [],
			loctionUrl: "/static/mylocation.png",
		};
	},
	onLoad(e) {
	    const share = decodeURIComponent(e.share);
		if (share == 1) {
			this.showBack = false;
			this.showHome = true;
		}
	},
	created() {
		this.mapContext = uni.createMapContext('map');
		this.mapContext.moveToLocation();
		this.colorTheme = this.$commonFun.hexify(this.$store.getters.color.theme);
		// this.mapContext = uni.createMapContext("map",this);
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
		getLocationList().then(res=>{
			this.locationData = res;
		})
	},
	methods: {
		back() {
			this.$Router.back(1);
		},
		home(){
			let this_ = this;
			uni.showModal({
				showCancel: false,
				title: "提示",
				content: "你可以在首页中下拉,找到校园导览重新打开此页面",
				complete() {
					this_.$Router.replaceAll({ name: 'schedule' });
				},
			});
		}
		,
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
		toDetail(nextItem){
			console.log("detail");
			uni.navigateTo({
			    url: '/pages/map/map-detail?name='+nextItem.name+'&location='+nextItem.location
			}); 
			
			// this.$Router.push({
			// 	name:"mark",
			// });
		},
		showLocation(nextItem){
			var lat = nextItem.location[0];
			var lng = nextItem.location[1];
			this.markers = [{
						iconPath: "/static/marker.png",
						id: 0,
						latitude: lat,
						longitude: lng,
						width: 35,
						height: 35,
						// title: nextItem.name,
						callout: {
							content: nextItem.name,
							fontSize: 13,
							color: '#ffffff',
							padding: 5,
							borderRadius: 15,
							bgColor: this.colorTheme,
							display: "ALWAYS",
						},
					}];
			let lct = lat +','+lng;
			let that = this;
			qqmapsdk.direction({
				mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
				//from参数不填默认当前地址
				to:lct,
				success: function (res) {
					// console.log(res);
					let ret = res;
					let coors = ret.result.routes[0].polyline, pl = [];
					that.markers[0].callout.content = nextItem.name + "  大约" + ret.result.routes[0].distance + "米";
					//坐标解压（返回的点串坐标，通过前向差分进行压缩）
					let kr = 1000000;
					for (let i = 2; i < coors.length; i++) {
					  coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
					}
					//将解压后的坐标放入点串数组pl中
					for (let i = 0; i < coors.length; i += 2) {
					  pl.push({ latitude: coors[i], longitude: coors[i + 1] })
					}
					// console.log(pl)
					//设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
					// that.latitude = pl[0].latitude,
					// that.longitude = pl[0].longitude,
					that.nowLocation = {
						lat:pl[0].latitude,
						lng:pl[0].longitude,
					};
					that.polyline = [{
						points: pl,
						color: that.colorTheme,
						width: 6,
						arrowLine: true,
					}];
				},
				fail: function (error) {
					setTimeout(function(){
						uni.hideToast();
					},1000);
					uni.showToast({
					    icon: "none",
					    title: "获取路径异常",
					});
				},
				complete: function(res) {
					that.mapContext.moveToLocation({
						latitude:lat,
						longitude:lng,
					})
				}
			});
			// translateMarker
		},
		showNavigation(nextItem) {
			let plugin = requirePlugin('routePlan');
			let key = '6ROBZ-HXOLX-L7M42-74U5S-7KFJJ-72F56';  //使用在腾讯位置服务申请的key
			let referer = 'gdutday导航';   //调用插件的app的名称
			let endPoint = JSON.stringify({  //终点
			    'name': nextItem.name,
			    'latitude': nextItem.location[0],
			    'longitude': nextItem.location[1]
			});
			uni.navigateTo({
			    url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
			});
		},
		openInitLocation() {
			var that = this
			uni.showModal({
				showCancel: false,
				title: "提示",
				content: "这个服务需要您打开位置，且给小程序位置权限以便给您提供优质的服务",
				complete() {
					that.mapContext.moveToLocation();
				},
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
			path: `/pages/map/map?share=1`
		};
	},
	onShareTimeline(){
		return {
			title: 'gdutday-校园导航分享给你',
			path: `/pages/map/map?share=1`
		}
	},
};
</script>

<style scoped lang="scss"></style>