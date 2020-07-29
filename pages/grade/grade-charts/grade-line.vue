<template>
	<view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">绩点变化情况</view></view>
		<view class="qiun-charts"><canvas canvas-id="poleLine" id="poleLine" class="charts" @touchstart="touchLine" /></view>
	</view>
</template>

<script>
import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.min.js';
let line = null;
export default {
	data() {
		return {};
	},
	inject: ['Bus'],
	computed: {
		everyTermsGrade() {
			return this.$store.getters.classifyGrade
				.filter(item => item.courseData.length)
				.map(item => {
					let all = 0,
						get = 0;
					item.courseData.forEach(item => {
						all = +item.credit + all;
						get = +item.credit * item.examPole + get;
					});
					return (get / all).toFixed(2);
				});
		},
	},
	created() {
		this.Bus.$on('changeGradeConfig',this.init)
	},
	beforeDestroy() {
		this.Bus.$off('changeGradeConfig',this.init)
	},
	methods: {
		init() {
			line = this.showLine(this, 'poleLine', {
				categories: ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'],
				series: [
					{
						name: '绩点',
						data: this.everyTermsGrade
					}
				]
			});
		},
		showLine(that, canvasId, chartData) {
			return new uCharts({
				$this: that,
				canvasId: canvasId,
				type: 'line',
				fontSize: 11,
				legend: {
					show: true
				},
				dataLabel: true,
				dataPointShape: true,
				background: '#FFFFFF',
				pixelRatio: 1,
				categories: chartData.categories,
				series: chartData.series,
				animation: true,
				xAxis: {
					type: 'grid',
					gridColor: '#CCCCCC',
					gridType: 'dash',
					dashLength: 8
				},
				yAxis: {
					gridType: 'dash',
					gridColor: '#CCCCCC',
					dashLength: 8,
					splitNumber: 1,
					min: 1,
					max: 5,
					format: val => {
						return val.toFixed(0);
					}
				},
				width: uni.upx2px(710),
				height: uni.upx2px(500),
				extra: {
					line: {
						type: 'straight'
					}
				}
			});
		},
		touchLine(e, obj) {
			//#ifndef H5
			  e.changedTouches[0].y = e.touches[0].y;
			  e.mp.changedTouches[0].y = e.touches[0].y;
			//#endif
			line.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data;
				}
			});
		}
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
