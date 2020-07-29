export const defaultCourseBlock = [{
    isDefault: true,
    courseRoom: "",
    courseTeacher: "gdutday小提示",
    courseDay: "6",
    courseName: '添加背景,更换主题',
    courseTime: "040506",
    courseWeekAndContent: Array.from({
        length: 20
    }, (item, index) => {
        return {
            courseContent: '',
            courseWeek: index + 1
        }
    })
},
{
    courseRoom: "",
    courseTeacher: "gdutday小提示",
    courseDay: "2",
    courseName: '开启课前自动弹框提示和消消乐',
    courseTime: "040506",
    courseWeekAndContent: Array.from({
        length: 20
    }, (item, index) => {
        return {
            courseContent: '',
            courseWeek: index + 1
        }
    }),
}
];