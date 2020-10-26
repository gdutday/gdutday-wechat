export default {
	encodeURI: false,
	routes: [{
			path: "/pages/schedule/schedule",
			name: 'schedule'
		},
		{
			path: "/pages/login/login",
			name: 'login'
		},
        {
        	path: "/pages/login/login-edu",
        	name: 'login-edu'
        },
		{
			path: "/pages/my/my-mark/my-mark",
			name: 'mark'
		},
        {
        	path: "/pages/my/my-task/my-task",
        	name: 'task'
        },
		{
			path: "/pages/my/my-clear/my-clear",
			name: 'clear'
		},
		{
			path: "/pages/my/my-index/my-index",
			name: 'my'
		},
		{
			path: "/pages/my/my-personalization/my-personalization",
			name: 'personalization'
		},
		{
			path: "/pages/my/my-about/my-about",
			name: 'about'
		},
        {
        	path: "/pages/my/my-problem/my-problem",
        	name: 'problem'
        },
		{
			path: "/pages/grade/grade",
			name: 'grade'
		},
		{
			path: '/pages/grade/grade-find/grade-find',
			name: 'findGrade'
		},
		{
			path: "/pages/map/map",
			name: 'map'
		},
		{
			path: "/pages/map/map-detail",
			name: 'mapDetail'
		},
		{
			path: "/pages/file/file-detail/file-detail",
			name: 'file_detail'
		},
        {
        	path: "/pages/exam/exam",
        	name: 'exam'
        },
		{
			path: "/pages/rubbish/rubbish",
			name: 'rubbish'
		}, {
			path: "/pages/pay/pay",
			name: 'pay'
		},
		{
			path: "/pages/library/library",
			name: 'library'
		},
		{
			path: "/pages/privacy/privacy",
			name: 'privacy'
		},
		{
			path: "/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-delete-course/plugin-delete-course",
			name: 'deleteCourse'
		},
		{
		    path : "/pages/news/news",
		    name : 'news'
		},{
		    path : "/pages/news/news-detail",
		    name : 'newsDetail'
		},{
			path:"/pages/library/douban",
			name:"douban"
		},
		...Array.from({
			length: 10
		}, (item, index) => ({
			path: `/pages/file/file_page/file_${index}`,
			name: `file_${index}`
		})),
	]
}
