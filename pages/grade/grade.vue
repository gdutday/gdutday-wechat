<template>
	<view class="bg-white pb-5">
		<cover-view class="text-white w-1 flex-row j-center a-center position-fixed mb" style="top:0px;z-index: 1000;box-shadow: 1px 2px 2px #CCCCCC;" :style="style + color">
			<cover-view @tap="toFind" class="flex-row a-center">
				<cover-image class="mr-1" style="width: 16px;height: 16px;" src="/static/find.png" />
				<cover-view>点击查看成绩</cover-view>
			</cover-view>
		</cover-view>
		<view :style="style"></view>
		<view class="text-gray bg-white text-df pl-1 py-2" style="margin-bottom: -10rpx;" v-if="!hasGrade">tip:现在没有成绩数据哦,以下是示例</view>
		<view v-if="delay" class="mt-5 rounded-2 depth-1 mx-2 pb-2 pt animation-slide-bottom"
		 v-for="(item, index) in 6" :key="index">
			<block v-if="index == 0"><grade-config /></block>
			<block v-else-if="index == 1"><classify-ring /></block>
			<block v-else-if="index == 2"><pole-line /></block>
			<block v-else-if="index == 3">
				<column-example />
				<get-grade-scores-column />
			</block>
			<block v-else-if="index == 4"><get-pole-column /></block>
			<block v-else-if="index == 5"><all-grade-scores-column /></block>
		</view>
        <yzmcom ref="reyzm" page="grade"/>
	</view>
</template>

<script>
import gradeConfig from '@/pages/grade/grade-config.vue';
import columnExample from '@/pages/grade/grade-charts/grade-column/column-example.vue';
import allGradeScoresColumn from '@/pages/grade/grade-charts/grade-column/all-grade-scores.vue';
import getPoleColumn from '@/pages/grade/grade-charts/grade-column/get-pole.vue';
import getGradeScoresColumn from '@/pages/grade/grade-charts/grade-column/get-grade-scores.vue';
import classifyRing from '@/pages/grade/grade-charts/grade-ring.vue';
import poleLine from '@/pages/grade/grade-charts/grade-line.vue';
import { APIs } from '@/staticData/staticData.js';
import { wait } from '@/commonFun.js';
import yzmcom from '@/components/cerbur-yzm.vue';
export default {
	components: {
        yzmcom,
		gradeConfig,
		columnExample,
		allGradeScoresColumn,
		getGradeScoresColumn,
		getPoleColumn,
		classifyRing,
		poleLine
	},
	provide() {
		return {
			Bus: this
		};
	},
	data() {
		return {
			loading: false,
			delay: false
		};
	},
	onLoad() {
		// #ifdef MP
		uni.showShareMenu();
		// #endif
	},
	// onReady() {
	// 	this.$emit('changeGradeConfig');
	// },
	onPullDownRefresh() {
        this.refreshGradeByEdu();
		// this.getGrade();
	},
	async mounted() {
		if (!this.hasGrade) !this.hasAccount ? this.$commonFun.interceptToLogin(this.$Router) : this.getGrade();
		uni.showLoading({
			title: '加载图表中'
		});
		await wait(600);
		uni.hideLoading();
		this.delay = true;
		this.$nextTick(() => this.$emit('changeGradeConfig'));
	},
	computed: {
		// lineStr(){
		// 	return `transform: translateX(${this.i ? 100 : 0 }%) scaleX(.7)`
		// },
		style() {
			return `height:${this.CustomBar}px;padding-top:${this.StatusBar}px;`;
		},
		color() {
			return `background-color:${this.$colorList.theme};`;
		},
		hasGrade() {
			// console.log(this.$store.state.grade.grade.length);
			return this.$store.state.grade.grade.length > 0;
		},
		hasAccount() {
			return !!this.$account.ID;
		},
        hasEducation() {
            return !!this.$education.ID;
        }
	},
	methods: {
		tip(title, icon = 'none') {
			uni.showToast({
				title: title,
				icon: icon
			});
		},
        refreshGradeByEdu() {
            if (this.loading) return;
            if (!this.hasEducation) {
                uni.stopPullDownRefresh()
                let that = this;
                uni.showModal({
                	title: "提示",
                	content: "还未登录哦,是否跳转到登录页面",
                	success: e =>
                		e.confirm ?
                		that.$Router.push({
                			name: "login-edu"
                		}) : ""
                });
                return;
            }
            this.$refs.reyzm.showModal();
            uni.stopPullDownRefresh();
        },
		async getGrade() {
			if (this.loading) return;
			if (!this.hasAccount) {
                return uni.stopPullDownRefresh() && this.tip('无账号,请先登录');
            }
			uni.showLoading({
				title: '查询成绩中..'
			});
			this.loading = true;
			try {
				const {
					data: { error, data }
				} = await this.$commonFun.rePromise({
					PromiseFunction: this.$http.post.bind(this.$http),
					parms: [
						APIs.grade,
						{
							schoolId: this.$account.ID,
							password: this.$account.password
						}
					]
				});
				if (+error == 1) {
					this.$store.commit('changeStateofGrade', {
						stateName: 'grade',
						value: data,
						toStorage: true,
						toStringify: true
					});
					this.tip(...(data.length ? ['成绩查询成功', 'success'] : ['查询成功,但无成绩数据']));
					this.$emit('changeGradeConfig');
				} else {
					this.tip('成绩查询失败,请重试');
				}
			} catch (e) {
				console.log(e);
				this.loading = false;
				uni.stopPullDownRefresh();
				this.tip('成绩查询失败,请重试');
			}
			this.loading = false;
			uni.stopPullDownRefresh();
		},
		toFind() {
			this.$Router.push({
				name: 'findGrade'
			});
		}
	}
};
</script>

<style scoped></style>
