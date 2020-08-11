<template>
	<view class="flex-row py-1" style="z-index: 100;">
		<view style="width: 50rpx;font-size:.8em" class="flex-column a-center j-center" :style="$themeFont">{{ months }}月</view>
		<view class="a-center j-center text-xs text-gray flex-1 flex-row h-1 " v-for="(item, i) in weekDay" @tap="selectDay" :data-index="i" :key="i">
			<view class="text-center flex-column j-center day-rounded position-relative">
				<!-- :style="i == day ? '' : (i == currentDay && week == currentWeek ? selectedDayStyleString.today : '')" -->
				<view
					class="w-1 h-1 position-center round text-center flex-column j-center transition-3 overflow-hidden"
					:style="
						i == day && week == currentWeek
							? $themeBackground + ';color:white;opacity:1;transform:translate(-50%,-50%) scale(1) '
							: 'transform:translate(-50%,-50%) scale(1);opacity:1'
					"
				>
					<!-- <text v-if="i === 0"></text> -->
					<!-- 选择日期的 -->
					<!-- :style="i == day ? $themeBackground + ';color:white;opacity:1;transform:translate(-50%,-50%) scale(1) ' : 'transform:translate(-50%,-50%) scale(0);opacity:0'" -->
					<!-- <text v-else>{{ item }}</text> -->
					<text>{{ item }}</text>
				</view>
				<text v-if="i != day">{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	inject: ['Bus'],
	data() {
		return {
			sevenDay: Array.from({ length: 7 }, () => '')
		};
	},
	computed: {
		week() {
			return this.$store.state.schedule.week;
		},
		day() {
			return this.$store.state.schedule.day;
		},
		selectedDayStyleString() {
			return {
				selected: `color:white;background-color: ${this.$colorList.theme}`,
				today: `color:${this.$colorList.theme};background-color:${this.$colorList.white}`
			};
		},
		currentWeek() {
			return this.$currentWeek;
		},
		currentDay() {
			return this.$currentDay;
		},
		weekDay() {
			return this.sevenDay.map(item => item.split('.')[1]);
		},
		months() {
			return this.sevenDay[0].split('.')[0];
		}
	},
	created() {
		this.dayResult();
	},
	methods: {
		selectDay(e) {
			// 选择日期的暂时删掉
			// this.$store.commit({
			// 	type: 'changeStateofSchedule',
			// 	stateName: 'day',
			// 	value: +e.currentTarget.dataset.index
			// });
		},
		dayFilter(oneDay) {
			const result = this.$commonFun.getDate(oneDay);
			//日历过滤
			const calendar = [
				{ day: '9.13', holiday: '中秋' },
				{ day: '9.23', holiday: '秋分' },
				{ day: '10.13', holiday: '重阳' },
				{ day: '10.1', holiday: '国庆' },
				{ day: '12.25', holiday: '圣诞' },
				{ day: '1.1', holiday: '元旦' }
			];
			// calendar.forEach(item => {
			// 	if (result == item.day) {
			// 		result = item.holiday;
			// 		return result;
			// 	}
			// });
			//现在想去掉月份
			// result = result.includes('.') ? (result.split('.')[1] == '1' ? result.split('.')[0] + '月' : result.split('.')[1]) : result;
			// result = result.split('.')[1];
			return result;
		},
		dayResult() {
			const weekDay = this.week * 7;
			this.sevenDay = this.sevenDay.map((item, index) => this.dayFilter(weekDay + index));
		}
	},
	watch: {
		week() {
			this.dayResult();
		}
	}
};
</script>
<style scoped lang="scss">
.day-rounded {
	width: 22px;
	height: 22px;
	border-radius: 50%;
}
</style>
