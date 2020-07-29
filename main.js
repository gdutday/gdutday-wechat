import Vue from 'vue'
import App from '@/App'

//顶部栏组件
import cuCustom from '@/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
// 涟漪组件
import ripple from '@/components/ripple.vue'
Vue.component('ripple', ripple);
// 提示组件
import tip from '@/components/xing-tip.vue'
Vue.component('tip', tip);
//弹框组件
import modal from '@/components/xing-modal.vue'
Vue.component('modal', modal);
//radio组件
import xingRadio from '@/components/xing-radio.vue'
Vue.component('xingRadio', xingRadio);
// 确认组件
import confirm from '@/components/xing-comfirm.vue'
Vue.component('comfirm', confirm);
Vue.component('confirm', confirm);

//空白提示
import emptyTip from '@/components/empty-tip.vue';
Vue.component('emptyTip', emptyTip);

//Vuex
import store from '@/store.js'
Vue.prototype.$store = store;

// 仿vue-router插件
import Router from '@/js_sdk/hhyang-uni-simple-router/index.js'
import routerConfig from '@/router-config.js'
Vue.use(Router)
new Router(routerConfig);

//挂载axios至全局
import {
	http,
	httpWithSession
} from '@/axios-config.js';
Vue.prototype.$http = http;
Vue.prototype.$httpWithSession = httpWithSession;

Vue.config.productionTip = true;
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()