import Vue from 'vue'
import Vuex from 'vuex'
import {
	getStorageSync,
	ChangeAndStorageState
} from '@/commonFun.js'
import {
	config
} from '@/config.js';
import allColor from '@/theme-color.js'
import schedule from '@/pages/schedule/schedule_store.js'
import grade from '@/pages/grade/grade_store.js';
import file from '@/pages/file/file_store.js';
Vue.use(Vuex)
let store = new Vuex.Store({
	modules: {
		schedule,
		grade,
		file
	},
	state: {
		//gray red orange blue cyan pink
		//第二个参数为默认颜色
		themeColor: allColor.otherTheme.theme ? 'otherTheme' : getStorageSync('themeColor', config.defaultColor),
		// themeColor: getStorageSync('themeColor','gray'),
		isShake: getStorageSync('isShake', true),
		// account: getStorageSync('account', {
		// 	ID: '',
		// 	password: ''
		// }, true),
		unifiedPassword: getStorageSync('unifiedPassword', ''),
		education: getStorageSync('education', {
			ID: '',
			password: ''
		}, true),
		allColor: allColor,
		// 使用一次验证码返回的cookie
		uuid:''
	},
	mutations: {
		changeStateofGlobal: ChangeAndStorageState,
		changeOtherTheme(state, par) {
			state.allColor.otherTheme = par;
			state.themeColor = 'otherTheme';
			uni.setStorageSync('otherTheme', JSON.stringify(par));
		},
	},
	getters: {
		color(state) {
			return state.allColor[state.themeColor];
		},
	}
})
const computed = {
	computed: {
		$uuid(){
			return store.state.uuid;
		},
		$colorList() {
			return store.getters.color;
			// this.$colorList = {
			// 	theme:'',
			// 	dark:'',
			// 	white:'',
			// 	side:''
			// }
		},
		$themeColor() {
			return store.state.themeColor;
		},
		$themeFont() {
			return `color:${store.getters.color.theme};`
		},

		$themeBackground() {
			return `background-color:${store.getters.color.theme};`
		},
		$isShake() {
			return store.state.isShake;
		},
		$account() {
			// return store.state.account;
			return store.state.education;
		},
		$unifiedPassword(){
			return store.state.unifiedPassword;
		},
		$education() {
			return store.state.education;
		},
	}
}
Vue.mixin(computed);
export const commit = store.commit;
export const state = store.state
export default store;
