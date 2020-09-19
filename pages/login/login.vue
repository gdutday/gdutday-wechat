<template>
	<view class="bg-white h-100">
		<cu-custom bgColor="bg-theme " :isBack="true"><block slot="content">登录</block></cu-custom>
		<view class="flex-column j-center a-center w-1 " style="height: 200px;">
			<image style="height: 100px;width: 100px;" src="/static/logo.png" />
			<view class="hg text-lg">gdutday欢迎你</view>
		</view>
		<!-- <myform></myform>-->
		<view class="flex-row j-center a-center">
			<form class="" style="width: 638rpx;">
				<myInput :maxlength="10" :textColor="$colorList.theme" :lineColor="$colorList.theme" type="text" v-model="ID" placeholder="学生卡号" tip="学号"></myInput>
				<myInput
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="password"
					v-model="password"
					placeholder="统一身份认证密码,初始密码为身份证后六位"
					tip="密码"
					:isShowPass="true"
				></myInput>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
				<view :class="onceShake ? 'animation-shake' : ''"><myButton :rotate="rotate" @buttonTap="tap" :text="'登录'" :bgColor="$colorList.theme" /></view>
			</form>
		</view>
		<view class="text-gray text-center hg-60">
			登录即默认您同意用户服务条款
		</view>
		<view class="footer">
			<text @tap="privacy">用户服务条款</text>
			<text>|</text>
			<text @tap="toAbout">关于我们</text>
			<text>|</text>
            <text @tap="toProblem">登录遇到问题</text>
		</view>
	</view>
</template>

<script>
// import myform from '@/pages/login/form.vue'
import myInput from '@/components/watch-input.vue';
import myButton from '@/components/watch-button.vue';
import ErrorTip from '@/components/form-error-tip.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	// components:{myform},
	components: { myInput, myButton, ErrorTip },
	data() {
		return {
			ID: '',
			password: '',
			rotate: false,
			onceShake: false,
			showTip: false,
			tip: ''
		};
	},
	mounted() {
		this.ID = this.$account.ID;
		this.password = this.$account.password;
	},
	methods: {
		tap() {
			if (this.ID.length != 10 || this.password.length < 6) {
				this.onceShake = true;
				this.showTip = true;
				this.tip = '学号为10位 , 初始密码为身份证后六位';
				setTimeout(() => {
					this.onceShake = false;
				}, 600);
				return;
			}
			this.showTip = false;
			this.rotate = true;
			this.request();
		},
		privacy(){
			this.$Router.push({name:'privacy'});
		},
		request() {
			this.$commonFun
				.rePromise({
					PromiseFunction: this.$http.post.bind(this.$http),
					parms: [APIs.curriculum, { schoolId: this.ID, password: this.password }],
					times: 3
				})
				.then(res => {
					this.rotate = false;
					if (+res.data.error == -201) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '学号不存在或密码错误';
					} else if (+res.data.error == -503) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '账号被教务系统判定为需要验证';
					} else if (+res.data.error == -501) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '教务系统异常';
					} else if (+res.data.error == -305) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '课表信息为空,若为20级目前教务系统未对接,请之后尝试';
					} else if (+res.data.error == 1) {
						// this.$store.commit('changeAccount', { ID: this.ID, password: this.password });
						this.$store.commit({
							type: 'changeStateofGlobal',
							stateName: 'account',
							value: { ID: this.ID, password: this.password },
							toStorage: true,
							toStringify: true
						});
						// console.log(res.data.data);
						this.$store.commit({
							type: 'changeStateofSchedule',
							stateName: 'classData',
							value: res.data.data,
							toStorage: true,
							toStringify: true
						});
						this.$Router.replaceAll({ name: 'schedule' });
					} else {
						this.showTip = true;
						this.tip = res.data.msg;
					}
				})
				.catch(res => {
					console.log(res);
					this.rotate = false;
					this.showTip = true;
					if (+res.statusCode == 404) {
						this.tip = '服务器故障 , 请稍后再试';
						return;
					} else if (res.errMsg == 'request:fail') {
						this.tip = '网络连接错误 , 请重试';
					} else {
						this.tip = '其他错误请重试 , 请重启小程序';
					}
				});
		},
		toAbout() {
			this.$Router.push({ name: 'about' });
		},
        toProblem() {
            this.$Router.push({ name: 'problem' });
        }
	},
	watch: {}
};
</script>
<style scoped>
.footer {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: rgba(0, 0, 0, 0.7);
	text-align: center;
	height: 40upx;
	line-height: 40upx;
}
.footer text {
	font-size: 14px;
	margin-left: 15upx;
	margin-right: 15upx;
}
</style>
