import Vue from "vue";
import {
	getStorageSync,
	getCurrentWeek,
	ChangeAndStorageState,
	deepCopy,
} from "@/commonFun.js";
import {
	textConflict,
	productClassData,
} from "@/pages/schedule/schedule-common-fun.js";
import {
	diffCampusTime,
	courseBlockColorList,
	defaultCourseBlock,
} from "@/staticData/staticData.js";
const weekLength = 20;
Vue.prototype.$weekLength = weekLength;
export default {
	state: {
		week: getCurrentWeek(),
		day: (new Date().getDay() || 7) - 1,
		index: 0,
		height:0,
		hasBackground: false,
		firstIndex: getStorageSync("firstIndex", 0),
		classData: getStorageSync("classData", defaultCourseBlock, true),
		examData: getStorageSync("examData", [], true),
		examNewData: getStorageSync("examNewData", [], true),
		addClassData: getStorageSync("addClassData", [], true),
        // countTimes: getStorageSync("countTimes", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],true), //校区
		campus: getStorageSync("campus", "大学城校区"), //校区
		courseBlockOpacity: getStorageSync("courseBlockOpacity", 80),
		isFontColorWhite: getStorageSync("isFontColorWhite", true),
		isPassedCourseBlockGray: getStorageSync(
			"isPassedCourseBlockGray",
			true
		),
	},
	mutations: {
		changeStateofSchedule: ChangeAndStorageState,
		changeAddClassData(state, Playload) {
			//state.addCourseData.push(par);
			//state.addCourseData.splice(index,1);
			//state.addCourseData.splice(index,1,detail);
			Playload.handle(state.addClassData);
			uni.setStorageSync(
				"addClassData",
				JSON.stringify(state.addClassData)
			);
		},
	},
	getters: {
		courseData(state, getters) {
			return productClassAndExam([
				...state.classData,
				...getters.handleAddClassData,
				...state.examData,
			]);
		},
		handlePrimeClassData(state) {
			return state.addClassData.map(item =>
				productClassData(deepCopy(item))
			);
		},
		existConflict(state, getters) {
			return deepCopy(getters.handlePrimeClassData).map((item, index) => {
				// debugger;
				const s = 1 * item.courseTime.slice(0, 2) - 1, //从0开始
					data = textConflict({
						parms: {
							start: getters.thisCampusTime[s].start,
							end: getters.thisCampusTime[
								item.courseTime.length / 2 + s - 1
							].end,
							day: +item.courseDay - 1,
						},
						ClassAndExam: [...state.classData, ...state.examData],
						during: getters.thisCampusTime,
					});
				const courseWeek = item.courseWeekAndContent.map(
					item => item.courseWeek - 1
				);
				data.forEach((item1, index) => {
					item1.conflictWeek = item1.week.filter(
						item2 => courseWeek.indexOf(item2) > -1
					);
				});
				return data.filter(item => item.conflictWeek.length > 0);
			});
		},
		handleAddClassData(state, getters) {
			return deepCopy(getters.handlePrimeClassData).map((item, index) => {
				let conflictWeek = [];
				getters.existConflict[index].forEach(item => {
					conflictWeek = [...conflictWeek, ...item.conflictWeek];
				});
				item.courseWeekAndContent = item.courseWeekAndContent.filter(
					item => {
						return conflictWeek.indexOf(item.courseWeek - 1) == -1;
					}
				);
				return item;
			});
		},
		thisCampusTime(state) {
			return diffCampusTime[state.campus];
		},

	},
};
let i = 1000

function add(a) {
	if (a > i) return 0
	else return a / (a + add(++a))
}

function productClassAndExam(classData) {
	let color = {};
	let mark = 0;
	let handleData = Array.from({
			length: weekLength
		}, () =>
		Array.from({
				length: 7,
			},
			() => []
		)
	);
	if (!classData.length) return handleData;
	classData.forEach((item, index) => {
		if (item.examWeek) {
			handleData[item.examWeek - 1][item.examDay - 1].push({
				name: item.examSubject,
				start: item.examTime.split("--")[0],
				end: item.examTime.split("--")[1],
				classroom: item.examClassroom,
				color: color[item.courseName] ||
					(color[item.courseName] =
						courseBlockColorList[
							mark++ % courseBlockColorList.length
						]),
				date: item.examDate,
				splitdate: item.examDate.split("-")[1] +
					"-" +
					item.examDate.split("-")[2],
				position: item.examPosition,
				isAdd: false,
				isExam: true,
			});
		} else {
			const time = item.courseTime;

			function MakeClass(content) {
				this.content = content;
				this.name = item.courseName;
				this.long = time.length / 2;
				this.begin = parseInt(
					time[0] == "0" ? time[1] : time[0] + time[1]
				);
				this.classroom = item.courseRoom;
				this.teacher = item.courseTeacher;
				this.color =
					color[item.courseName] ||
					(color[item.courseName] =
						courseBlockColorList[
							mark++ % courseBlockColorList.length
						]);
				if ((this.isAdd = !!item.isAdd)) {
					//用时间标记add
					this.addTag = item.addTag;
				}
			}
			item.courseWeekAndContent.forEach(nextItem => {
				handleData[nextItem.courseWeek - 1][item.courseDay - 1].push(
					new MakeClass(nextItem.courseContent)
				);
			});
		}
	});
	return handleData;
}

function productSchedule() {}
 