<template>
	<view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">平均绩点(学分绩点之和/学期学分之和) <text @tap="toAsk" class="cuIcon-question text-xs ml-1"/></view></view>
		<view class="qiun-charts"><canvas canvas-id="levelsRing" id="levelsRing" class="charts" @touchstart="touchRing" /></view>
	</view>
</template>

<script>
import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.min.js';
let ring = null;
export default {
	inject: ['Bus'],
	computed: {
		classifyPoleGrade() {
			const level5 = [];
			const levels = [
				{
					level: '不合格(1以下)',
					grades: []
				},
				{
					level: '合格(1~2)',
					grades: []
				},
				{
					level: '一般(2~3)',
					grades: []
				},
				{
					level: '良好(3~4)',
					grades: []
				},
				{
					level: '优秀(4~5)',
					grades: level5
				},
				{
					level: '优秀(4~5)',
					grades: level5
				}
			];
			this.$store.getters.termsGrade.forEach(item => {
				item.courseData.forEach(item => levels[Math.floor(+item.examPole)].grades.push(item));
			});
			levels.pop();
			return levels;
		}
	},
	created() {
		this.Bus.$on('changeGradeConfig', this.init);
	},
	beforeDestroy() {
		this.Bus.$off('changeGradeConfig', this.init);
	},
	methods: {
		init() {
			ring = this.showRing(this, 'levelsRing', {
				series: this.classifyPoleGrade.map(item => {
					return {
						name: item.level,
						data: item.grades.length
					};
				})
			});
		},
		toAsk(){
			this.$Router.push({
				name:'privacy'
			})
		},
		showRing(that, canvasId, chartData) {
			const colors = ['#f04864', '#FF7293', '#FFE655', '#33C8FD', '#40C769'];
			return new uCharts({
				$this: that,
				canvasId: canvasId,
				colors: colors,
				type: 'ring',
				fontSize: 11,
				legend: true,
				title: {
					name: (this.$store.getters.scoresPole.get / this.$store.getters.scoresPole.all).toFixed(2),
					color: '#7cb5ec',
					fontSize: 25,
					offsetY: 0
				},
				subtitle: {
					name: '平均绩点',
					color: '#666666',
					fontSize: 12,
					offsetY: 0
				},
				extra: {
					pie: {
						offsetAngle: -45,
						ringWidth: 25,
						labelWidth: 15
					}
				},
				background: '#FFFFFF',
				pixelRatio: 1,
				series: chartData.series,
				animation: true,
				width: uni.upx2px(710),
				height: uni.upx2px(500),
				disablePieStroke: true,
				dataLabel: true
			});
		},
		touchRing(e) {
			//#ifndef H5
			e.changedTouches[0].y = e.touches[0].y;
			e.mp.changedTouches[0].y = e.touches[0].y;
			//#endif
			ring.showToolTip(e, {
				format: function(item) {
					return item.name + ':' + item.data + '科';
				}
			});
		}
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
