<template>
	<view class="bg-white h-100">
		<cu-custom bgColor="bg-theme " :isBack="true"><block slot="content">登录</block></cu-custom>
		<view class="flex-column j-center a-center w-1 " style="height: 200px;">
			<image style="height: 100px;width: 100px;" src="/static/logo.png" />
			<view class="hg text-lg">教务系统密码登录</view>
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
					placeholder="教务系统密码"
					tip="教务系统密码"
					:isShowPass="true"
				></myInput>
                <myInput :maxlength="4" :textColor="$colorList.theme" :lineColor="$colorList.theme" type="text" v-model="verifyCode" placeholder="验证码" tip="验证码"></myInput>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
                <view class="text-center">
                    <image @tap="refreshYzm" :src="yzm" class="text-center yzmImage" style="width: 200rpx;height: 140rpx">
                </view>
				<view :class="onceShake ? 'animation-shake' : ''"><myButton :rotate="rotate" @buttonTap="tap" :text="'登录'" :bgColor="$colorList.theme" /></view>
			</form>
		</view>
	</view>
</template>

<script>
// import myform from '@/pages/login/form.vue'
import polyfill from '@/js_sdk/base64/base64.min.js';
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
            verifyCode: '',
			password: '',
			rotate: false,
			onceShake: false,
			showTip: false,
			tip: '',
            yzm:'',
            session:'',
		};
	},
	mounted() {
		this.ID = this.$account.ID;
        this.getImage();
	},
    created() {
	},
	methods: {
		tap() {
			if (this.ID.length != 10 || this.password.length < 6 ||this.verifyCode.length < 4) {
				this.onceShake = true;
				this.showTip = true;
				this.tip = '学号为10位 , 密码为教务系统密码,并填写验证码';
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
					parms: [APIs.educationInit, { 
                        schoolId: this.ID, 
                        password: this.password,
                        verifyCode: this.verifyCode,
                        session: this.session
                        }],
					times: 3
				})
				.then(res => {
					this.rotate = false;
                    if (+res.data.error != 1) {
                        this.refreshYzm();
                    }
					if (+res.data.error == -201) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '学号不存在或密码错误';
					} else if (+res.data.error == -503) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '账号被教务系统判定为需要验证,或者验证码错误';
					} else if (+res.data.error == -501) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '教务系统异常';
					} else if (+res.data.error == -305) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '课表信息为空,若为20级目前教务系统未对接,请之后尝试';
					} else if (+res.data.error == 1) {
                        console.log(res.data.data);
						this.$store.commit({
							type: 'changeStateofSchedule',
							stateName: 'classData',
							value: res.data.data.curriculum,
							toStorage: true,
							toStringify: true
						});
                        this.$store.commit({
                        	type: 'changeStateofSchedule',
                        	stateName: 'campus',
                        	value: res.data.data.campus,
                        	toStorage: true
                        });
                        let _this = this;
                        uni.showModal({
                        	showCancel: false,
                        	title: "提示",
                        	content: "教务系统由于特殊原因,无法自动更新,请在之后教务系统与统一身份认证系统对接完成后,使用统一身份认证系统登录",
                            complete() {
                                _this.$Router.replaceAll({ name: 'schedule' });
                            }
                        });
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
        refreshYzm(){
            this.getImage();
            this.verifyCode = '';
        },
        async getImage(){
            let time = new Date().getTime();
            let url = 'https://jxfw.gdut.edu.cn/yzm?d='+time.toString();
            uni.request({
                method:'GET',
                url: url,
                data:{},
                responseType:'arraybuffer',
                header:{
                    'Accept':'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Connection': 'keep-alive',
                    'content-type': 'image/jpeg',
                },
                success: (res) => {
                        let cookie = res.header["Set-Cookie"];
                        let session = cookie.substring(cookie.indexOf("=")+1,cookie.indexOf(";"));
                        let imgs = 'data:image/jpeg;base64,' + polyfill.btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                        this.yzm = imgs;
                        this.session = session;
                    }
            })
        },
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
