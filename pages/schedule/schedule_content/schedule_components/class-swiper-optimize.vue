<template>
	<swiper style="overflow:auto;height: 100%;width: 700rpx;" :indicator-dots="false" @change="change" :duration="500" circular>
		<swiper-item class="all-1" v-for="(item, index) in 3" :key="index">
			<view v-if="showLoginButton" class="position-center text-white text-center text-lg depth-5 login-button" :style="$themeBackground" @tap="toLogin">登录</view>
			<view class="swiper-item all-1"><week :week="swiperList[index]"></week></view>
		</swiper-item>
	</swiper>
</template>
<script>
import week from '@/pages/schedule/schedule_content/schedule_components/schedule_week/week-content.vue';
import store from '@/store.js';
import xingSwiperComponent from '@/components/xing-swiper.js';
let xingSwiper;
export function changeSwiperComponent(options){
	xingSwiper = xingSwiperComponent(options);
}
changeSwiperComponent({
	length: store.getters.courseData.length,
	index: store.state.schedule.week
});
export default {
	components: {
		week
	},
	mixins: [xingSwiper],
	inject: ['Bus'],
	props: {},
	data() {
		return {
			// swiperList: [],
			// isMount: true,
			// current: 0
			swiperList: [this.$store.state.schedule.week, 0, 0],
		};
	},
	computed: {
		week() {
			return this.$store.state.schedule.week;
		},
		showLoginButton() {
			return this.$store.state.schedule.classData[0].isDefault || !(this.$store.state.schedule.classData.length + this.$store.state.schedule.examData.length);
		}
	},
	created() {
	},
	beforeDestroy() {
		// this.Bus.$off('showLoginButton');
	},
	methods: {
		change(e) {
			// this.current = e.detail.current;
			const {detail:{current}} = e
			this.swiperCurrent = current;
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'week',
				value: this.swiperList[current]
			});
			this.Bus.$emit('autoHidePlugin');
		},
		toLogin() {
			this.$Router.push({ name: 'login' });
		}
	},
	watch: {
		week() {
			this.refreshIndex(this.week);
		}
	}
};
</script>
<style scoped>
.login-button {
	width: 200rpx;
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 15rpx;
	z-index: 10;
}
</style>
