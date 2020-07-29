'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const res = await uniCloud.httpclient.request("http://47.116.46.16/functions/getPayImg", {
		mothod: 'POST',
		data: {
			schoolId: '3118005362',
			password: '280236',
			months: '1'
		},
		timeout:30000
	})
	console.log(res)
	//返回数据给客户端
	return res;
};
