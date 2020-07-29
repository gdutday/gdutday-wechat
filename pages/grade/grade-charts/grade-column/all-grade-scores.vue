<template>
	<view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">学期学分排行</view></view>
		<view class="qiun-charts">
			<canvas canvas-id="allGradeColumn" id="allGradeColumn" class="charts" @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndColumn" />
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
	created() {
		this.Bus.$on('changeGradeConfig',this.init)
	},
	beforeDestroy() {
		this.Bus.$off('changeGradeConfig',this.init)
	},
	inject:['Bus'],
	methods: {
		init() {
			column = showColumn(this, 'allGradeColumn', grade2series(this.$store.getters.sortGradeByPole, item => +item.credit), {
				format: val => +val.toFixed(0) + '学分',
				max: Math.ceil(+this.$store.getters.sortGradeByPole[0].credit)
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
		touchEndColumn(e) {
			column.scrollEnd(e);
			//下面是toolTip事件，如果滚动后不需要显示，可不填写
			column.showToolTip(e, {
				format: (item, category) => {
					return `${item.data.examTime} ${item.data.readMethod}`;
				}
			});
		}
	}
};
</script>

<style></style>
