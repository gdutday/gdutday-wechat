<template>
		<view style="" class="back position-fixed toBack leave">
			<view @tap="goTo" :style="'background-color:' + $colorList.side" class="button flex j-center a-center depth-4 active-shadow">
				<text class="text-white button-text">
					导航
				</text>
			</view>
		</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props:{
		location : [String],
		name: [String],
	},
	methods: {
		goTo() {
			console.log(this.location)
			let _this = this;
			let locationArray = this.location.split(",")
			// this.$Router.pushTab({name:'schedule'})
			let plugin = requirePlugin('routePlan');
			let key = '6ROBZ-HXOLX-L7M42-74U5S-7KFJJ-72F56';  //使用在腾讯位置服务申请的key
			let referer = 'gdutday导航';   //调用插件的app的名称
			let endPoint = JSON.stringify({  //终点
			    'name': _this.name,
			    'latitude': locationArray[0],
			    'longitude': locationArray[1]
			});
			uni.navigateTo({
			    url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
			});
		}
	}
};
</script>

<style scoped lang="scss">
.button {
	height: 55px;
	line-height: 55px;
	width: 55px;
	border-radius: 50%;
	.button-text {
		font-size: 16px;
	}
}
.toBack {
	right: 17.5px;
	bottom: 35px;
	z-index: 100;
}
</style>
