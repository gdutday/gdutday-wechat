<template>
		<view style="" class="back position-fixed toBack leave">
			<view @tap="toBack" :style="'background-color:' + $colorList.side" class="button flex j-center a-center depth-4 active-shadow">
				<text class="text-white button-text">
					主页
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
		
	},
	methods: {
		toBack() {
			// this.$store.commit('clearStack');
			this.$Router.pushTab({name:'schedule'})
			// this.$Router.({
			// 	name: 'file_0
			// });
			// while( > 0) {
				// uni.navigateBack({
				// 	delta: this.$store.state.file.stack.length
				// });
			// }
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
