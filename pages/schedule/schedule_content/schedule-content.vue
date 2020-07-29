<template>
	<view class="flex-column h-1">
		<view
			class="position-relative flex-1 bg-white bg-img overflow-hidden"
			id="content"
			:style="backgroundString"
		>
			<xing-refresh
				@pushToInterrupt="shake"
				v-if="scrollHeight && delay"
				:scrollHeight="scrollHeight"
				:topHeight="interruptPosition + 20"
				:interruptPosition="interruptPosition"
				:triggleHeight="interruptPosition / 2"
				:fontColor="fontColor"
				:reMountMark="reMountMark"
			>
				<!-- :delay="" -->
				<!-- <template v-slot:top>
                <extensions :interruptPosition="interruptPosition" />
            </template> -->
				<!-- <block v-if="true"> -->
				<!--  <template v-slot:content>  
                <block v-if="firstIndex">
                    <view :style="'height:' + (scrollHeight - 32) + 'px'" style="width: 750rpx;">
                        <daySchedule />
                    </view>
                </block>
                <block v-else>
                    <select-day />
                    <view class="flex-row" :style="'height:' + (scrollHeight - 32) + 'px'" style="width: 750rpx;">
                        <view class="flex-column" :class="fontColor" style="width: 50rpx;border-radius: 25rpx;">
                            <view class="flex flex-1 a-center j-center" v-for="(item, index) in 12" :key="index">{{ index + 1 }}</view>
                        </view>
                        <swiperoptimize v-if="reMountMark&&delay" />
                    </view>
                </block>
            </template> -->
				<!-- <template v-slot:bottom>
                <block v-if="firstIndex">
                    <select-day />
                    <view class="flex-row" :style="'height:' + (scrollHeight - 32) + 'px'" style="width: 750rpx;">
                        <view class="flex-column" :class="fontColor" style="width: 50rpx;border-radius: 25rpx;">
                            <view class="flex flex-1 a-center j-center" v-for="(item, index) in 12" :key="index">{{ index + 1 }}</view>
                        </view>
                        <swiperoptimize v-if="reMountMark" />
                    </view>
                </block>
                <block v-else>
                    <view :style="'height:' + (scrollHeight - 32) + 'px'" style="width: 750rpx;">
                        <daySchedule />
                    </view>
                </block>
            </template> -->
				<!-- </block> -->
			</xing-refresh>
		</view>
		<view
			class="animation-fade"
			style="animation-duration:.5s;"
			@animationstart="toHeight"
		></view>
	</view>
</template>

<script>
import { wait } from '@/commonFun.js';
import scheduleItemList from '@/pages/schedule/schedule_content/schedule_list/schedule-item-list.vue';
import xingRefresh from '@/pages/schedule/schedule_content/schedule_components/xing-refresh.vue';
import daySchedule from '@/pages/schedule/schedule_content/schedule_components/schedule-day-schedule/day-schedule.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	components: {
		scheduleItemList,
		xingRefresh,
		daySchedule
	},
	props: {},
	inject: ['Bus'],
	data() {
		return {
			handleData: Array.from(
				{
					length: this.$store.state.schedule.weekLength
				},
				() => null
			),
			backgroundImage: this.$commonFun.getStorageSync(
				'backgroundImage',
				''
			),
			backgroundString: '',
			reMountMark: true,
			scrollHeight: 0,
			interruptPosition: 2 * 73, //几行就几个73
			delay: false
		};
	},
	computed: {
		hasBackground() {
			return this.backgroundImage != '';
		},
		fontColor() {
			const color = this.$store.state.schedule.isFontColorWhite;
			return this.hasBackground
				? color
					? 'black-opacity text-white'
					: 'white-opacity text-black'
				: 'text-black';
		},
		classData() {
			return this.$store.state.schedule.classData;
		},
		firstIndex() {
			return this.$store.state.schedule.firstIndex;
		}
	},
	beforeDestroy() {
		this.Bus.$off('reMountWeekContent');
	},
	created() {
		this.Bus.$on('reMountWeekContent', () => {
			this.reMountMark = false;
			this.$nextTick(() => {
				this.reMountMark = true;
			});
		});
		this.$store.commit({
			type: 'changeStateofSchedule',
			stateName: 'hasBackground',
			value: this.hasBackground
		});
		this.handleBackground();
		this.getClassData();
		this.Bus.$on('setBackground', img => (this.backgroundImage = img));
	},
	beforeDestroy() {
		this.Bus.$off('setBackground');
	},
	async mounted() {
		uni.showLoading({
			title: '加载中'
		});
		await wait(300);
		uni.hideLoading();
		this.delay = true;
	},
	methods: {
		toHeight() {
			const query = uni
				.createSelectorQuery()
				.in(this)
				.select('#content');
			query
				.boundingClientRect(res => {
					this.scrollHeight = res.height;
					this.$store.commit({
						type: 'changeStateofSchedule',
						stateName: 'height',
						value: res.height
					});
					this.autoOpenClassMessage();
				})
				.exec();
		},
		getClassData() {
			//获取本地中的课表
			//每周获取一次获取课表
			//课表存在则验证是否是本周第一次打开 若是则自动发送请求更新课表
			if (this.$account.password != '') {
				const count = this.$commonFun.getStorageSync(
					'countTimes',
					Array.from(
						{
							length: 20
						},
						() => 0
					),
					true
				);
				if (+count[this.$currentWeek] === 0 && Math.random() < 1 / 5) {
					this.$commonFun
						.rePromise({
							PromiseFunction: this.$http.post.bind(this.$http),
							parms: [
								APIs.classAndExam,
								{
									schoolId: this.$account.ID,
									password: this.$account.password
								}
							],
							times: 2
						})
						.then(res => {
							if (+res.data.error == 1) {
								const {
									curriculum,
									exam,
									campus
								} = res.data.data;
								this.$store.commit({
									type: 'changeStateofSchedule',
									stateName: 'classData',
									value: curriculum,
									toStorage: true,
									toStringify: true
								});
								this.$store.commit({
									type: 'changeStateofSchedule',
									stateName: 'examData',
									value: exam,
									toStorage: true,
									toStringify: true
								});
								this.$store.commit({
									type: 'changeStateofSchedule',
									stateName: 'campus',
									value: campus,
									toStorage: true
								});
								this.$commonFun.countTimes();
								this.Bus.$refs['tip'].show('课表已刷新');
								console.log('更新课表');
							} else {
								this.Bus.$refs['tip'].show(
									'课表更新失败 , 服务器端故障或密码变更'
								);
								console.log(res, '更新失败');
							}
						})
						.catch(res => {
							//待写提示
							this.Bus.$refs['tip'].show('请检查网络');
							console.log(res, '网络问题');
						});
				} else {
					console.log('本周已更新');
				}
			} else {
				console.log('无账号,无需更新');
			}
		},
		autoOpenClassMessage() {
			const date = new Date(),
				range = Array.from(
					{
						length: 8 + 1
					},
					(item, index) => index * 5
				),
				i = this.$commonFun.getStorageSync('noticeTime', 0),
				day = this.$currentDay;
			range.push(Infinity); //总长是42
			if (
				i &&
				this.$store.getters.courseData[this.$currentWeek][day].length
			) {
				const classStar = this.$store.getters.thisCampusTime.map(
						(item, index) => {
							return (
								parseInt(item.start.split(':')[0]) * 60 +
								parseInt(item.start.split(':')[1])
							);
						}
					),
					todayMinutes = date.getHours() * 60 + date.getMinutes(),
					//因为get的日期是从星期日开始的 所以 必须判断这个特殊情况
					courseData = this.$store.getters.courseData[
						this.$currentWeek
					]
						.slice(day, day + 2)
						.map((item, index) => {
							return item.sort((a, b) => a.begin - b.begin);
							//排列后方便跳出
						});
				//some返回true时跳出循环;
				courseData.some((item, index) => {
					return item.some(nextItem => {
						//考试情况
						//index从0开始 使inifinty可以弹出明日课程
						const diff =
							(nextItem.isExam
								? nextItem.start.split(':')[0] * 60 +
								  1 * nextItem.start.split(':')[1]
								: classStar[nextItem.begin - 1]) +
							index * 24 * 60 -
							todayMinutes;
						if (diff >= 0 && diff <= range[i]) {
							this.Bus.$emit('openModal', nextItem);
							return true;
						}
					});
				});
			}
		},
		handleBackground() {
			if (this.backgroundImage == '') return (this.backgroundString = '');
			uni.getSystemInfo({
				success: res => {
					if (res.platform == 'ios') {
						uni.getFileSystemManager().readFile({
							filePath: this.backgroundImage,
							encoding: 'base64',
							success: res =>
								(this.backgroundString =
									'background-image:url(data:image;base64,' +
									res.data +
									');')
						});
					} else {
						this.backgroundString =
							'background-image:url(' +
							this.backgroundImage +
							');';
					}
				}
			});
		},
		tap() {
			this.Bus.$emit('autoHidePlugin');
		},
		shake() {
			uni.vibrateShort();
		}
	},
	watch: {
		backgroundImage() {
			this.handleBackground();
		},
		hasBackground() {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'hasBackground',
				value: !!this.hasBackground
			});
		}
	}
};
</script>

<style scoped></style>
