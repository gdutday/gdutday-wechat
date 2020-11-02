<script>
import Vue from 'vue';
import { APIs } from '@/staticData/staticData.js';
import {
	getStorageSync,
	getCurrentWeek,
	openSchoolChangeTips,
	commonFun,
	getClassAndExam
} from '@/commonFun.js';
import { http } from '@/axios-config.js';
export default {
	onLaunch() {
		//从0开始
		//计数
		const currentWeek = getCurrentWeek();
		Vue.prototype.$currentWeek = currentWeek;
		Vue.prototype.$currentDay = (new Date().getDay() || 7) - 1;
		//设置bar颜色
		//这个iconlist要跟pages.json里面的icon对应!
		const barColor =
			this.$themeColor == 'otherTheme'
				? this.$commonFun.hexify(this.$allColor.gray.theme)
				: this.$commonFun.hexify(this.$colorList.theme);
		const iconList = ['task_fill', 'grade', 'people_fill'].map(item => {
			return `static/bar/${this.$themeColor}/${item}.png`;
		});
		uni.setTabBarStyle({
			color: '#A1A1A1',
			selectedColor: barColor,
			backgroundColor: '#ffffff',
			borderStyle: 'white'
		});
		if (this.$themeColor !== 'otherTheme') {
			iconList.forEach((item, index) => {
				uni.setTabBarItem({
					index: index,
					selectedIconPath: iconList[index]
				});
			});
		}
		//获取高度以设置导航栏
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = uni.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-QQ
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + 45;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
		// 修复因考试安排与课表冲突导致的白屏
		Vue.prototype.$store.commit({
			type: 'changeStateofSchedule',
			stateName: 'examData',
			value: [],
			toStorage: true,
			toStringify: true
		});
	},
	onShow() {},
	onHide: function() {
		console.log('App Hide');
	},
	created() {
		this.schoolOpening().catch(e => console.log(e));
	},
	methods: {
		async schoolOpening() {
			const {
				data: { schoolOpening }
			} = await http.get(APIs.getSchoolOpening);
			var oldTime = uni.getStorageSync('schoolOpening');
			uni.setStorageSync('schoolOpening', schoolOpening);
			if (oldTime !== schoolOpening) {
				// TODO 刷新一次课表
				openSchoolChangeTips();
			}
		}
	}
};
</script>

<style lang="scss">
@import '/theme-color.css';
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'colorui/animation.css';
@import 'components/gaoyia-parse/parse.css';
@import 'colorui/zcm-main.css';

ripple {
	width: 100%;
	height: 100%;
}
</style>
