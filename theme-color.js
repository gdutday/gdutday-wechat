import Vue from 'vue'
const allColor = {
	/* 青色 */
	/* 主,深,浅,副色 */
	cyan: {
		theme: 'rgba(13,167,165,1)',
		dark: 'rgba(12,108,98,1)',
		white: 'rgba(193,232,226,1)',
		side: 'rgba(255,126,20,1)',
	},
	/* 珊瑚红 */
	red: {
		theme: 'rgba(236,100,85,1)',
		dark: 'rgba(193,56,48,1)',
		white: 'rgba(242,217,215,1)',
		side: 'rgba(48,167,63,1)',
	},
	/* 橙色 */
	orange: {
		theme: 'rgba(250,132,36,1)',
		dark: 'rgba(210,93,0,1)',
		white: 'rgba(246,226,215,1)',
		side: 'rgba(18,147,142,1)',
	},
	/* 粉色 */
	pink: {
		theme: 'rgba(236,106,142,1)',
		dark: 'rgba(213,73,112,1)',
		white: 'rgba(246,225,230,1)',
		side: 'rgba(160,238,100,1)',
	},
	/* 蓝色 */
	blue: {
		theme: 'rgba(24,105,186,1)',
		dark: 'rgba(0,73,149,1)',
		white: 'rgba(208,226,240,1)',
		side: 'rgba(255,151,5,1)',
	},
	/* 灰色 */
	gray: {
		theme: 'rgba(117,117,117,1)',
		dark: 'rgba(67,67,67,1)',
		white: 'rgba(206,206,206,1)',
		side: 'rgba(84,84,84,1)',
	},
}
let otherTheme;
try {
	otherTheme = uni.getStorageSync('otherTheme');
} catch (e) {
	otherTheme = "";
}
if (otherTheme != "") {
	allColor.otherTheme = JSON.parse(otherTheme);
}else{
	allColor.otherTheme = {
		theme:'',
		dark:'',
		white:'',
		side:''
	}
}
Vue.prototype.$allColor = allColor;
export default allColor;
