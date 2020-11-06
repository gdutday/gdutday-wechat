<template>
	<!-- https://ext.dcloud.net.cn/plugin?id=1521 修改而成 -->
	<!-- 获取一个数组，结构为[{date:'时间',info:'内容内容'}] -->
	<!-- @click事件返回点击标签元素的索引值 第一项为0 -->
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">考试安排</block></cu-custom>
		<!-- <view>{{ infoList.length }}</view> -->
		<!-- <view class="mt-3 text-center" v-if="infoList.length == 0">
			<text>没有考试安排,可以尝试下拉刷新喔!</text>
			<br />
			<text>20级使用教务系统的同学</text>
			<br />
			<text>可以点击教务系统重新登录获取</text>
			<button
				style="width: 25vh;"
				class="text-white"
				@tap="tap"
				:style="{ backgroundColor: backgroundColor }"
			>
				教务系统
			</button>
		</view> -->
		<!-- <view  class="m-center" :class="onceShake ? 'animation-shake' : ''">
                <myButton :rotate="rotate" @buttonTap="tap" :text="'教务系统'" :bgColor="$colorList.theme" />
            </view> -->

		<view class="steps mt-2">
			<view class="steps_item" v-for="(i, index) in infoList" :key="index">
				<view class="s_r">
					<view
						class="line"
						:style="{
							backgroundColor:
								index != 0
									? i.examCountDown >= 0
										? backgroundColor
										: '#7a7374'
									: 'rgba(0,0,0,0)'
						}"
					/>
					<view
						class="index"
						:style="{
							backgroundColor:
								i.examCountDown >= 0 ? backgroundColor : '#7a7374',
							color: color
						}"
					>
						{{ handleExamCountDown(i.examCountDown) }}
					</view>
					<view
						class="line"
						:style="{
							backgroundColor:
								index != infoList.length - 1
									? i.examCountDown >= 0
										? backgroundColor
										: '#7a7374'
									: 'rgba(0,0,0,0)'
						}"
					></view>
				</view>
				<view class="s_l">
					<view class="info_item" @tap="topage(index)">
						<text class="time">{{ i.examDate + ' ' + i.examTime }}</text>
						<view>
							<text class="cuIcon-tag mr-1" />
							{{ i.examSubject }}
						</view>
						<view>
							<text class="cuIcon-location mr-1" />
							{{
								i.examClassroom + i.examPosition === ''
									? '座位未出'
									: '座位号:' + i.examPosition + '号'
							}}
						</view>
						<view>
							<text class="cuIcon-time mr-1" />
							{{ i.examWeek + '周星期' + i.examDay }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<yzmcom @fail="fail" ref="reyzm" page="exam" />
	</view>
</template>
<script>
import { APIs } from '@/staticData/staticData.js';
import { getDayDiff, goToLoginUpdate } from '@/commonFun.js';
import yzmcom from '@/components/cerbur-yzm.vue';
export default {
	components: { yzmcom },
	provide() {
		return {
			Bus: this
		};
	},
	data() {
		return {
			rotate: false,
			onceShake: false,
			infoList: [],
			color: '#fff',
			backgroundColor: this.$commonFun.hexify(this.$store.getters.color.theme),
			lineNum: 0
		};
	},
	onLoad(e) {
		this.getExam();
		this.$on('changeExamNewData', () => this.getExam());
	},
	beforeDestroy() {
		this.$off('changeExamNewData');
	},
	onPullDownRefresh() {
		this.refreshGradeByEdu();

		// this.refreshYzm();
		// this.refreshGrade();
	},
	computed: {
		hasAccount() {
			return !!this.$account.ID;
		},
		hasEducation() {
			return !!this.$education.ID;
		}
	},
	methods: {
		tap() {
			this.$Router.push({
				name: 'login-edu'
			});
		},
		tip(title, icon = 'none') {
			uni.showToast({
				title: title,
				icon: icon
			});
		},
		topage(e) {
			this.$emit('click', e);
		},
		handleExamCountDown(examCountDown) {
			let subffix;
			if (examCountDown > 9) subffix = '';
			else if (examCountDown > 0) subffix = '天';
			else if (examCountDown === 0) subffix = '今';
			else subffix = '结';
			return examCountDown + subffix;
		},
		getExam() {
			//获取列表
			let examList = JSON.parse(uni.getStorageSync('examNewData'));
			let examNoEnd = [];
			let examEnd = [];
			examList.forEach(it => {
				it.examCountDown = getDayDiff(it.examDate);
				if (it.examCountDown >= 0) {
					examNoEnd.push(it);
				} else {
					examEnd.push(it);
				}
			});
			examNoEnd.sort((a, b) => a.examCountDown - b.examCountDown);
			examEnd.sort((a, b) => b.examCountDown - a.examCountDown);
			this.infoList = examNoEnd.concat(examEnd);
		},
		refreshGradeByEdu() {
			if (this.loading) return;
			this.$refs.reyzm.showModal();
		},
		fail() {
			uni.stopPullDownRefresh();
		}
		// async refreshGrade() {
		// 	if (this.loading) return;
		// 	if (this.$education.ID.length === 0)
		// 		return uni.stopPullDownRefresh() && this.tip('无账号,请先登录');
		// 	uni.showLoading({
		// 		title: '查询考试中..'
		// 	});
		// 	this.loading = true;
		// 	try {
		// 		const {
		// 			data: { error, data }
		// 		} = await this.$commonFun
		// 			.rePromise({
		// 				PromiseFunction: this.$http.post.bind(this.$http),
		// 				parms: [
		// 					APIs.exam,
		// 					{
		// 						schoolId: this.$account.ID,
		// 						password: this.$account.password
		// 					}
		// 				]
		// 			})
		// 			.finally(() => {
		// 				uni.stopPullDownRefresh();
		// 				this.loading = false;
		// 			});
		// 		if (+error == 1) {
		// 			this.$store.commit('changeStateofGrade', {
		// 				stateName: 'examNewData',
		// 				value: data,
		// 				toStorage: true,
		// 				toStringify: true
		// 			});
		// 			this.tip(
		// 				...(data.length
		// 					? ['考试安排查询成功', 'success']
		// 					: ['查询成功,但无数据'])
		// 			);
		// 			console.log(111)
		// 			this.getExam();
		// 			console.log(222)
		// 		} else {
		// 			this.tip('考试查询失败,请重试');
		// 		}
		// 	} catch (e) {
		// 		console.log(e);
		// 		uni.stopPullDownRefresh();
		// 		this.tip('考试查询失败,请重试');
		// 	}
		// }
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}

.bg {
	margin: 20upx 0;
	background-color: #f2f2f2;
	display: flex;
}
.steps {
	display: flex;
	flex-direction: column;

	.steps_item {
		display: flex;

		.s_r {
			// padding: 0 80rpx;
			padding-left: 80rpx;
			padding-right: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.line {
				flex: 3;
				width: 7rpx;
				background-color: #fff;
			}

			.index {
				width: 50rpx;
				height: 50rpx;
				font-size: 12px;
				text-align: center;
				line-height: 55rpx;
				border-radius: 50rpx;
			}
		}

		.s_l {
			width: 500rpx;
			display: flex;
			flex-direction: column;
			padding: 20rpx 0;
			.info_item {
				background-color: #ffffff;
				margin-right: 30upx;
				border-radius: 10upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 30upx;
				box-shadow: 0 10rpx 30rpx #ddd;

				.time {
					font-size: 18px;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 25px;
				}

				view {
					font-size: 14px;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					line-height: 20px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;

					flex-direction: column;
				}
			}

			.info_item:active {
				background-color: #f4f4f4;
			}
		}
	}
}
</style>
