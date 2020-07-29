import {
	thisCampusTime
} from '@/staticData/staticData.js'
import commonFun from '@/commonFun.js'
export function productClassData(par={}) {
	// {
	// 	week:[],
	// 	name:'',
	// 	room:'',
	// 	start:0,//开始课,0开始
	// 	day:0,//星期,0开始
	// 	long:0//课程长度 , 0开始
	// }
	let weekChoose = par.week;
	let data = {
		courseDay: par.day + 1 + '',
		courseName: par.name,
		courseRoom: par.room,
		courseTeacher: '',
		courseTime: Array.from({
			length: par.long + 1
		}, (item, index) => ((index + par.start + 1 < 10) ? '0' : '') + (index + par.start + 1)).join(''),
		courseWeekAndContent: weekChoose.map(item => ({
			courseContent: '',
			courseWeek: item + 1 + ''
		})),
		isAdd: true ,//源数据,
		addTag:par.addTag
	};
	return data;
}
export function computedTimeConflict(a, b) {
	const s_a = commonFun.computedTimeString(a.start, "0:0", "-");
	const s_b = commonFun.computedTimeString(b.start, "0:0", "-");
	const diff_a = Array.from({
		length: commonFun.computedTimeString(a.end, a.start, "-")
	}, (item, index) => index + s_a);
	const diff_b = Array.from({
		length: commonFun.computedTimeString(b.end, b.start, "-")
	}, (item, index) => index + s_b);
	return diff_a.some(item => diff_b.indexOf(item) > -1);
}

export function handleCourseTimeString(item, during) {
	const start = +item.slice(0, 2)
	const long = item.length / 2;
	return {
		start: during[start - 1].start,
		end: during[start + long - 2].end
	};
}

export function textConflict({ parms,ClassAndExam = [],during = thisCampusTime } = {} ) {
	//检测冲突
	//ClassAndExam为两者数据,这个是未处理数据
	//week和day都是从0开始;start,end输入以下格式11:30 或者11:08;
	// debugger;
	const {
		day,
		start,
		end,
	} = parms;
	let result = []; //返回冲突周数,课程名称,课程时间
	ClassAndExam.forEach(item => {
		const time = item.courseTime ? handleCourseTimeString(item.courseTime,during) : {
			start: item.examTime.split('--')[0],
			end: item.examTime.split('--')[1]
		}
		if ((+day == ((item.courseDay || item.examDay) - 1)) && computedTimeConflict(time, {
				start: start,
				end: end
			})) {
			if (item.examPosition) {
				result.push({
					week: [item.examWeek - 1],
					day: day,
					start: time.start,
					end: time.end,
					name: item.examSubject,
					isExam : true
				})
			} else {
				result.push({
					week: item.courseWeekAndContent.map(item => item.courseWeek - 1),
					day: day,
					start: time.start,
					end: time.end,
					name: item.courseName
				})
			}
		}
	})
	return result;
}