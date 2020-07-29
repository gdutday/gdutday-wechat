<template>
	<view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">学分绩点排行(学科学分*学科绩点)</view></view>
		<view class="qiun-charts">
			<canvas canvas-id="getGradeColumn" id="getGradeColumn" class="charts" @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndGetColumn" />
		</view>
	</view>
</template>

<script>
import commonFun from '@/pages/grade/grade-common-fun.js';
let { grade2series, showColumn } = commonFun,
	column = null;
export default {
	data() {
		return {};
	},
	inject:['Bus'],
	computed: {
		sortScoresGrade() {
			return this.$commonFun.deepCopy(this.$store.getters.sortGradeByPole).sort((a, b) => +b.examPole * b.credit - a.examPole * a.credit);
		}
	},
	created() {
		this.Bus.$on('changeGradeConfig',this.init)
	},
	beforeDestroy() {
		this.Bus.$off('changeGradeConfig',this.init)
	},
	methods: {
		init() {
			column = showColumn(this, 'getGradeColumn', grade2series(this.sortScoresGrade, item => (+item.credit * (+item.examPole)).toFixed(2)), {
				format: val => +val.toFixed(0)
			});
		},
		touchColumn(e) {
			//#ifndef H5
			  e.changedTouches[0].y = e.touches[0].y;
			  e.mp.changedTouches[0].y = e.touches[0].y;
			//#endif
			column.scrollStart(e);
		},
		moveColumn(e) {
			column.scroll(e);
		},
		touchEndGetColumn(e) {
			column.scrollEnd(e);
			//下面是toolTip事件，如果滚动后不需要显示，可不填写
			column.showToolTip(e, {
				format: (item, category) => {
					const num = ((+item.data.credit * item.data.examPole * 100) / this.$store.getters.scoresPole.get).toFixed(2);
					return `学分:${item.data.credit} 绩点:${item.data.examPole} 贡献率:${num}% ${item.data.examTerm} ${item.data.readMethod}`;
				}
			});
		}
	}
};
</script>
<style scoped lang="scss"></style>
