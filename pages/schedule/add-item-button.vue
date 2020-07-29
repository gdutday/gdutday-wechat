<template>
	<view>
		<view class="position-fixed plugin leave" :class="index == 1 ? 'back': ''">
			<view  :style="'background:' + $colorList.side" class="button flex j-center a-center depth-4 active-shadow">
				<text class="cuIcon-writefill text-white button-text "></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	inject: ['Bus'],
	data() {
		return {
		};
	},
	computed: {
		index(){
			return this.$store.state.schedule.index;
		}
	},
	methods: {
	}
};
</script>

<style scoped lang="scss">
.plugin {
	right: 17.5px;
	bottom: 35px;
}
.button {
	height: 55px;
	line-height: 55px;
	width: 55px;
	border-radius: 50%;
	.button-text {
		font-size: 24px;
	}
}
</style>
