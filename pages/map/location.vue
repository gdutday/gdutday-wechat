<template>
	<view>
		<!-- <view style="width: 750rpx;height: 750rpx;" class="bg-white position-relative">
			<image v-if="!show" class="position-absolute all-1 gif-white response position-center" src="https://image.weilanwl.com/gif/rhomb-white.gif" mode="aspectFit">
			</image>
		</view>		
		<map
			v-if="show"
			:show-scale="true"
			:enable-3D="true"
			:show-location="true"
			:show-compass="true"
			:enable-overlooking="true"
			:skew="15"
			:scale="18"
			:markers="markers"
			class="animation-fade animation-4"
			style="width: 750rpx;height: 750rpx;"
			:latitude="location.latitude"
			:longitude="location.longitude"
		>
			<cover-view class="cover-back" @tap="back"><cover-image src="/static/back.png" /></cover-view>
		</map>
		<modal ref="modal" :maskForce="true">
			<comfirm @success="toSetting" @fail="back" title="提示">
				您拒绝了地址授权,是否到设置界面重新开启(如果点击确定无反应 , 请您点击右上角 , 找到设置 , 允许定位后重新打开本页面)
			</comfirm>
		</modal> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				markers: [],
				location: {},
			}
		},
		created(){
			// uni.getLocation({
			// 	type: 'gcj02',
			// 	success: res => {
			// 		this.getLoacationNext(res);
			// 	},
			// 	fail: res => {
			// 		if (this.$refs.modal.showModal) this.$refs.modal.showModal();
			// 	}
			// });
		},
		methods: {
			back() {
				this.$refs.modal.hideModal();
				this.$Router.back(1);
			},
			
			// async toSetting() {
			// 	this.$refs.modal.hideModal();
			// 	try {
			// 		const { authSetting } = await this.$commonFun.becomePromise(uni.openSetting),
			// 			confirm = authSetting['scope.userLocation'];
			// 		if (confirm) {
			// 			this.getLoacationNext(await this.$commonFun.becomePromise(uni.getLocation, { type: 'gcj02' }));
			// 		} else {
			// 		}
			// 	} catch (e) {}
			// },
			// getLoacationNext(location) {
			// 	this.location = location;
			// 	this.markers.push({
			// 		latitude: location.latitude,
			// 		longitude: location.longitude,
			// 		id: this.markers.length,
			// 		title: '你的位置'
			// 	});
			// 	this.$nextTick(() => {
			// 		this.show = true;
			// 	});
			// },
		}
	}
</script>

<style scoped>
.cover-back {
	margin-left: 15px;
	padding-top: 20px;
	height: 23px;
	line-height: 23px;
	width: 25px;
}
</style>
