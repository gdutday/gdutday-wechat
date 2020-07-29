//配置仿axios插件
import commonFun from '@/commonFun.js'
import Request from '@/js_sdk/luch-request/request.js'
import {
	APIs
} from '@/staticData/staticData.js';
import {
	config
} from '@/config.js';
const baseUrl = `https://${ config.dev ? 'test' : 'api' }.cerbur.top`;
const http = new Request();
http.setConfig((config) => {
	/* config 为默认全局配置*/
	config.baseUrl = baseUrl; /* 根域名 */
	config.header = {
		'content-type': 'application/x-www-form-urlencoded'
	}
	return config
})

//配置一个请求头带seesion_id的axios
let httpWithSession = http;
// #ifdef MP-WEIXIN
httpWithSession = new Request();

// function setHttpWithSession(loginToken) {
// 	if (loginToken) {
// 		httpWithSession.setConfig((config) => {
// 			config.baseUrl = baseUrl; /* 根域名 */
// 			config.header = {
// 				'content-type': 'application/x-www-form-urlencoded',
// 				'loginToken': loginToken
// 			}
// 			return config;
// 		})
// 		console.log(httpWithSession);
// 	} else getCode();
// }
// setHttpWithSession(commonFun.getStorageSync('loginToken', ''))
// 拿sessionid并存入缓存
// async function getCode(provider = 'weixin') {
// 	try {
// 		const {
// 			code: wxCode
// 		} = await commonFun.becomePromise(uni.login, {
// 			provider
// 		}, 'login');
// 		const {
// 			data: {
// 				data: {
// 					loginToken,
// 					openid
// 				}
// 			}
// 		} = await commonFun.rePromise({
// 			PromiseFunction: http.post.bind(http),
// 			parms: [APIs.login, {
// 				wxCode
// 			}],
// 			times: 3
// 		});
// 		uni.setStorageSync('loginToken', loginToken);
// 		uni.setStorageSync('openid', openid);
// 		setHttpWithSession(loginToken);
// 	} catch (e) {
// 		console.log(e);
// 	}
// }
//拦截失效的sessionid请求
httpWithSession.interceptor.response((response) => {
	if (+response.data.error == 401) {
		getCode();
	}
	return response
}, (response) => response)

// #endif
export {
	httpWithSession,
	http
};