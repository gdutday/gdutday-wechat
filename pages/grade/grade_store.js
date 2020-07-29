import commonFun from '@/commonFun.js';
import {
	deepCopy
} from '@/commonFun.js';
import {
	defaultGrade,
	colors
} from '@/pages/grade/grade_static.js';
export default {
	state: {
		grade: commonFun.getStorageSync('grade', [], true),
		isIncludeOptionalCourse: commonFun.getStorageSync('isIncludeOptionalCourse', false),
		selectTerms: commonFun.getStorageSync('selectTerms', '大学全')
	},
	mutations: {
		changeStateofGrade: commonFun.ChangeAndStorageState,
	},
	getters: {
		grade(state) {
			function cutLength(item) {
				const name = item.examName;
				const maxLength = 14;
				if (name.length > maxLength) {
					item.examName = name.slice(0, maxLength) + '...';
				}
				return item;
			}
			return state.grade.length > 0 
			? deepCopy(state.grade)
				.map(cutLength)
				.filter(item=> !(item.examType === '重修')) 
			: defaultGrade;
		},
		gradeAddColor(state, getters) {
			return getters.grade.map(item => {
				item.color = colors[Math.floor(+item.examPole)];
				return item;
			});
		},
		filterOptionalGrade(state, getters) {
			//是否选择必修的过滤
			return state.isIncludeOptionalCourse ?
				getters.gradeAddColor :
				getters.gradeAddColor.filter(nextItem => !(nextItem.readMethod == '选修' && nextItem.classType == "公共选修课"));
		},
		classifyGrade(state, getters) {
			// 对成绩进行分组
			const terms = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];
			let handleData = [];
			getters.filterOptionalGrade.forEach(item => {
				//里面加了一步 , 加项进去
				if (handleData.every(nextItem => nextItem.examTime == item.examTime ? (nextItem.courseData.push(item) && false) :
						true)) {
					handleData.push({
						examTime: item.examTime,
						courseData: [item]
					});
				}
			});
			//排序学期
			handleData.sort(function(a, b) {
				a = a.examTime.slice(0, 4) + (a.examTime.slice(-2) == "春季" ? '0' : '1')
				b = b.examTime.slice(0, 4) + (b.examTime.slice(-2) == "春季" ? '0' : '1')
				return +a - b;
			})
			//加学期信息
			handleData.forEach((item, index) => {
				item.examTerm = terms[index];
				item.courseData.forEach(item => item.examTerm = terms[index])
			});
			return handleData;
		},
		//用户选择的学期包含的成绩,由季度分开.
		termsGrade(state, getters) {
			let termsGrade = [],
				transform = {
					一: 0,
					二: 1,
					三: 2,
					四: 3,
					上: 0,
					下: 1
				};
			if (state.selectTerms == '大学全') {
				termsGrade = getters.classifyGrade;
			} else {
				const index = transform[state.selectTerms[1]] * 2;
				state.selectTerms[2] == '全' ? (termsGrade = getters.classifyGrade.slice(index, index + 2)) : termsGrade.push(
					getters.classifyGrade[index + transform[state.selectTerms[2]]]);
			}
			return termsGrade;
		},
		sortGradeByPole(state, getters) {
			let scores = [];
			commonFun
				.deepCopy(getters.termsGrade)
				.forEach(
					item =>
					(scores = [...scores, ...item.courseData])
				);
			scores.sort((a, b) => +b.credit - a.credit);
			return scores;
		},
		scoresPole(state, getters) {
			let get = 0,
				all = 0;
			getters.sortGradeByPole.forEach(item => {
				get = +item.credit * item.examPole + get;
				all = +item.credit + all;
			});
			return {
				get,
				all
			};
		},
		allScoresPole(state, getters) {
			let get = 0,
				all = 0;
			getters.grade.forEach(item => {
				get = +item.credit * item.examPole + get;
				all = +item.credit + all;
			});
			return {
				get,
				all
			};
		},
	}
}
