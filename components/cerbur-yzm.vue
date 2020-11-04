<template>
	<view>
		<modal ref="modal" :maskForce="true">
			<comfirm
				@success="success"
				@fail="fail"
				title="输入验证码以更新"
				:confirmText="confirmText"
				:comfirmColor="!loading ? '' : 'background-color:rgba(184,184,184,1);'"
			>
				<view class="text-center">
					<image
						@tap="refreshYzm"
						:src="yzm"
						class="text-center"
						style="width: 288rpx;height: 150rpx"
					/>
				</view>
				<myInput
					:maxlength="4"
					:textColor="$colorList.theme"
					:lineColor="$colorList.theme"
					type="text"
					v-model="verifyCode"
					placeholder="如验证码不显示验请点击查看遇到问题"
					tip="验证码"
				></myInput>
				<ErrorTip :showTip="showTip">{{ tip }}</ErrorTip>
			</comfirm>
		</modal>
	</view>
</template>

<script>
import polyfill from '@/js_sdk/base64/base64.min.js';
import { APIs } from '@/staticData/staticData.js';
import myInput from '@/components/watch-input.vue';
import ErrorTip from '@/components/form-error-tip.vue';
export default {
	components: { myInput, ErrorTip },
	inject: ['Bus'],
	props: {
		page: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			confirmText: '更新',
			loading: false,
			ID: '',
			password: '',
			showTip: false,
			tip: '',
			yzm: '',
			session: '',
			verifyCode: ''
		};
	},
	onLoad() {},
	methods: {
		showModal() {
			this.getImage();
			(this.ID = this.$education.ID),
				(this.password = this.$education.password),
				this.$refs.modal.showModal();
		},
		hideModal() {
			this.showTip = false;
			this.tip = '';
			this.verifyCode = '';
			this.$emit('hideModal');
			this.$refs.modal.hideModal();
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
				}
			});
		},
		refreshYzm() {
			this.getImage();
			this.verifyCode = '';
		},
		async request() {
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
						this.showTip = true;
						this.tip = '学号不存在或密码错误';
					} else if (+res.data.error == -503) {
						this.showTip = true;
						this.tip = '账号被教务系统判定为需要验证,或者验证码错误';
					} else if (+res.data.error == -501) {
						this.showTip = true;
						this.tip = '教务系统异常';
					} else if (+res.data.error == -305) {
						console.log(res.data);
						this.showTip = true;
						this.tip = '课表信息为空,若为20级目前教务系统未对接,请之后尝试';
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
						if (this.page == 'exam') {
							this.Bus.$emit('changeExamNewData');
						}
						this.$store.commit('changeStateofGrade', {
							stateName: 'grade',
							value: res.data.data.grade,
							toStorage: true,
							toStringify: true
						});
						this.hideModal();
						uni.showToast({
							title: '更新成功',
							icon: 'success'
						});
						if (this.page == 'grade') {
							console.log('grade');
							this.Bus.$emit('changeGradeConfig');
						}
					} else {
						this.showTip = true;
						this.tip = res.data.msg;
					}
					this.loading = false;
					this.confirmText = '更新';
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
					this.loading = false;
					this.confirmText = '更新';
				});
		},
		success() {
			if (this.verifyCode.length < 4) {
				this.showTip = true;
				this.tip = '填写4位验证码';
				return;
			}
			if (this.loading == false) {
				this.loading = true;
				this.confirmText = '更新中..';
				this.request();
			}
		},
		fail() {
			this.hideModal();
			this.$emit('fail')
		}
	}
};
</script>

<style></style>
