import uCharts from "@/js_sdk/u-charts/u-charts/u-charts.min.js";

function computeGrade(...grade) {
	let sum = 0;
	let allCredit = 0;
	grade.forEach((term_grade) => {
		term_grade.courseData.forEach((every_grade, index) => {
			// console.log(every_grade.examPole,every_grade.credit)
			sum += +every_grade.examPole * every_grade.credit;
			allCredit += +every_grade.credit;
		})
	})
	return allCredit != 0 ? (sum / allCredit).toFixed(3) : 0
}

function showColumn(
	that,
	canvasId,
	chartData, {
		max = 6,
		format = val => val.toFixed(0)
	} = {}
) {
	return new uCharts({
		$this: that,
		canvasId: canvasId,
		type: "column",
		legend: {
			show: true
		}, //说明
		fontSize: 11,
		background: "#FFFFFF",
		pixelRatio: 1,
		animation: true,
		categories: chartData.categories,
		series: chartData.series,
		legend: {
			show: false
		},
		xAxis: {
			disableGrid: true,
			type: "grid",
			gridType: "dash",
			rotateLabel: true,
			itemCount: 12,
			scrollShow: true,
			scrollAlign: "left",
			scrollBackgroundColor: "#F7F7FF",
			scrollColor: "#DEE7F7"
		},
		yAxis: {
			min: 0,
			max: max,
			format: format
		},
		dataLabel: true,
		width: uni.upx2px(710),
		height: uni.upx2px(500),
		enableScroll: true,
		extra: {
			column: {
				type: "group"
			}
		}
	});
};

function showArcbar(
	that, canvasId,
	chartData, {
		title = chartData => Math.round(chartData.series[0].data * 100) + "%",
		subtitle = chartData => chartData.series[0].name
	} = {}
) {
	const arcbarWidth = uni.upx2px(24),
		width = uni.upx2px(250);
	return new uCharts({
		$this: that,
		canvasId: canvasId,
		type: "arcbar",
		fontSize: 11,
		legend: {
			show: false
		},
		background: "#FFFFFF",
		pixelRatio: 1,
		series: chartData.series,
		animation: true,
		width: width,
		height: width,
		dataLabel: true,
		title: {
			name: title(chartData), //这里我自动计算了，您可以直接给任意字符串
			color: chartData.series[0].color,
			fontSize: 25
		},
		subtitle: {
			name: subtitle(chartData), //这里您可以直接给任意字符串
			color: "#666666",
			fontSize: 15
		},
		extra: {
			arcbar: {
				type: "default",
				width: arcbarWidth //圆弧的宽度
			}
		}
	});
};
const colors = [
	"rgb(164,214,249)",
	"rgb(251,118,116)",
	"rgb(229,227,118)",
	"rgb(251,208,144)",
	"rgb(129,199,132)",
	"rgb(228,198,63)",
	"rgb(139,210,216)",
	"rgb(229,118,195)"
];
function grade2series(sortGrade, handle) {

	let colorList = {},
		i = 0;
	return {
		categories: sortGrade.map(item => item.examName),
		series: [{
			name: "1",
			data: sortGrade.map(item => {
				return {
					...item,
					value: handle(item),
					color: colorList[item.examTime] || (colorList[item.examTime] = colors[i++]),
				};
			})
		}]
	};
};
export default {
	computeGrade,
	showArcbar,
	showColumn,
	grade2series,
	colors
}
