<template>
	<view>
		<block class="" v-for="(i, index) in 2" :key="index">
			<view :class=" (index===0 ? show : -show) > 0 ? 'back' : ''" class="position-fixed toBack leave">
				<view @tap="toBack" :style="'background:#F5F3F6;color:' + $colorList.side" class="button flex j-center a-center depth-4 active-shadow">
					<text :class="index===0 ? '' : 'text-reverse'" class="cuIcon-back button-text"></text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	inject: ['Bus'],
	computed: {
		show() {
			// return (this.$store.state.schedule.week - this.$currentWeek) || (this.$store.state.schedule.day - this.$currentDay) ;
			return this.$store.state.schedule.week - this.$currentWeek;
		}
	},
	methods: {
		toBack() {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'week',
				value: this.$currentWeek
			});
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'day',
				value: this.$currentDay
			});
			this.Bus.$emit('reMountWeekContent');
			this.$isShake ? uni.vibrateShort() : '';
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
		font-size: 22px;
	}
}
.toBack {
	right: 90px;
	bottom: 35px;
	z-index: 100;
}
.text-reverse {
	transform: rotate(-180deg);
}
</style>
