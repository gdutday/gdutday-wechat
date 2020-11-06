<template>
	<view class="bg-white h-100">
		<cu-custom :isBack="true"><block slot="content">登录</block></cu-custom>
		<view class="flex-column j-center a-center w-1 " style="height: 200px;">
			<image style="height: 100px;width: 100px;" src="/static/logo.png" />
			<view class="hg text-lg">教务系统登录</view>
			<!-- <view class="text-lg">统一身份认证系统异常暂用教务系统</view>
			<view class="text-lg">教务系统无法自动刷新,刷新自行重新登录</view> -->
		</view>
		<!-- <myform></myform>-->
		<view class="flex-row j-center a-center">
			<form class="" style="width: 638rpx;">
				<myInput
					:maxlength="10"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="text"
					v-model="ID"
					placeholder="学生卡号"
					tip="学号"
				/>
				<myInput
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="password"
					v-model="password"
					placeholder="教务系统密码"
					tip="教务系统密码"
					:isShowPass="true"
				/>
				<myInput
					:maxlength="4"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					style="display:inline-block;"
					width="350rpx"
					type="text"
					v-model="verifyCode"
					placeholder="不显示点击查看遇到问题"
					tip="验证码"
				/>
				<image
					@tap="refreshYzm"
					:src="yzm"
					class="yzmImage"
					style="width: 288rpx;height: 100rpx;vertical-align: bottom;"
				/>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
				<!-- <view class="text-center"></view> -->
				<view :class="onceShake ? 'animation-shake' : ''" class="mt-3">
					<myButton
						:rotate="rotate"
						@buttonTap="tap"
						:text="'登录'"
						:bgColor="$colorList.theme"
					/>
				</view>
			</form>
		</view>
		<view class="text-gray text-center hg-60">登录即默认您同意用户服务条款</view>
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
			yzm: '',
			session: ''
		};
	},
	mounted() {
		this.getImage();
		this.ID = this.$education.ID;
		this.password = this.$education.password;
	},
	created() {},
	methods: {
		tap() {
			if (
				this.ID.length != 10 ||
				this.password.length < 6 ||
				this.verifyCode.length < 4
			) {
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
		privacy() {
			this.$Router.push({ name: 'privacy' });
		},
		request() {
			this.$commonFun
				.rePromise({
					PromiseFunction: this.$http.post.bind(this.$http),
					parms: [
						APIs.educationInit,
						{
							schoolId: this.ID,
							password: this.password,
							verifyCode: this.verifyCode,
							session: this.session
						}
					],
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
						this.tip =
							'学号不存在或教务系统密码错误或教务系统密码为默认密码。';
							// 教务系统密码包含特殊字符，请先前往教务系统验证密码；若密码为默认密码，也无法登录，请前往教务系统修改默认密码后再次尝试
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
						this.tip =
							'课表信息为空,若为新年级则是目前教务系统未对接,请之后尝试';
					} else if (+res.data.error == 1) {
						this.$store.commit({
							type: 'changeStateofGlobal',
							stateName: 'education',
							value: { ID: this.ID, password: this.password },
							toStorage: true,
							toStringify: true
						});
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
						this.$store.commit({
							type: 'changeStateofSchedule',
							stateName: 'examNewData',
							value: res.data.data.exam,
							toStorage: true,
							toStringify: true
						});
						this.$store.commit('changeStateofGrade', {
							stateName: 'grade',
							value: res.data.data.grade,
							toStorage: true,
							toStringify: true
						});
						let _this = this;
						uni.showModal({
							showCancel: false,
							title: '您已经登录成功！',
							content:
								'由于统一认证平台限制,暂时无法自动更新课表。若有需求,请前往『账户与数据』重新登录即可',
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
						this.tip = '其他错误 , 请重启小程序';
					}
				});
		},
		refreshYzm() {
			this.getImage();
			this.verifyCode = '';
		},
		toAbout() {
			this.$Router.push({ name: 'about' });
		},
		toProblem() {
			this.$Router.push({ name: 'problem' });
		},
		async getImage() {
			let time = new Date().getTime();
			let url = 'https://jxfw.gdut.edu.cn/yzm?d=' + time.toString();
			uni.request({
				method: 'GET',
				url: url,
				data: {},
				responseType: 'arraybuffer',
				header: {
					Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
					Connection: 'keep-alive',
					'content-type': 'image/jpeg'
				},
				success: res => {
					let cookie = res.header['Set-Cookie'];
					if (cookie) {
						let session = cookie.substring(
							cookie.indexOf('=') + 1,
							cookie.indexOf(';')
						);
						let imgs =
							'data:image/jpeg;base64,' +
							polyfill.btoa(
								new Uint8Array(res.data).reduce(
									(data, byte) => data + String.fromCharCode(byte),
									''
								)
							);
						this.yzm = imgs;
						this.session = session;
					} else {
						this.tip = '无法获取验证码，请联系开发者';
						this.showTip = true;
					}
				}
			});
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
