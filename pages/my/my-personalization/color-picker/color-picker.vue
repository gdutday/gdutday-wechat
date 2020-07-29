<template>
	<view>
		<block v-for="(item, key) in color" :key="key">
			<view @tap="choose" class="hg px-5 flex-row bg-white j-sb a-center ripple" style="width: 600rpx;" :data-key="key">
				<text>{{ item.name }}</text>
				<view class="color-select" :style="'background-color:' + $colorList[key]"></view>
			</view>
		</block>
	</view>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			color: {
				theme: {
					name: '主色',
					description: '选择主色'
				},
				white: {
					name: '浅色',
					description: '选择浅色'
				},
				dark: {
					name: '深色',
					description: '选择深色'
				},
				side: {
					name: '对比色',
					description: '选择对比色'
				}
			}
		};
	},
	created() {},
	methods: {
		choose(e) {
			this.$emit('choose', { key: e.currentTarget.dataset.key, description: this.color[e.currentTarget.dataset.key].description });
		}
	}
};
</script>
<style scoped>
.color-select {
	width: 75rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-radius: 50%;
}
</style>
