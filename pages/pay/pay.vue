<template>
	<view class="bg-white" style="min-height: 100vh;">
		<cu-custom isBack>
			<template v-slot:content>
				校园网付费
			</template>
		</cu-custom>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<text class="qiun-title-dot-light text-lg">校园网账户信息</text>
			<text
				@tap="getInfo"
				v-if="status !== STATUS.LOADING_INFO"
				class="cuIcon-refresh text-xl ml-2"
			/>
		</view>
		<image
			v-if="status === STATUS.LOADING_INFO"
			class="gif-white response w-1 bg-white"
			style="height:500rpx"
			src="https://image.weilanwl.com/gif/loading-1.gif"
			mode="aspectFit"
		/>
		<view v-else class="animation-fade">
			<view
				class="hg flex-row j-sb a-center px-5 border-bottom bg-white text-lg"
				v-for="(item, key, index) in infoCN"
				:key="index"
			>
				<text>{{ key }}</text>
				<text :style="$themeFont">{{ item }}</text>
			</view>
		</view>
		<view class="px-3 pt-2">
			<view class="text-xs text-gray h-25 cuIcon-title">
				未开户请先前往综合数字平台开户
			</view>
			<view class="text-xs text-gray h-25 cuIcon-title">
				信息仅供参考，最终以校园缴费平台记录为准。
			</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<text class="qiun-title-dot-light text-lg">缴费</text>
			<text
				@tap="openLog"
				class="ml-2 text-sm"
				:style="'color:' + $colorList.white"
			>
				获取过的订单
			</text>
		</view>
		<view class="px-3 text-lg mt-2">
			<view class="flex-row a-center">
				<picker
					:disabled="status >= STATUS.LOADING_SRC"
					v-if="status !== STATUS.LOADED_SRC_SUCCESS"
					mode="selector"
					style="border:2px solid #ccc;width:250rpx"
					class="mr-3 h-40 px-3 bg-white rounded-1"
					:class="this.status >= STATUS.LOADING_SRC ? 'disabledBtn' : ''"
					:value="multiple"
					:range="range"
					@change="slide"
				>
					<view class="flex-row j-sb">
						<view :style="$themeFont">{{ money }}</view>
						<view>元</view>
					</view>
				</picker>
				<view
					@tap.stop="open"
					:class="this.status === STATUS.LOADING_SRC ? 'disabledBtn' : 'Btn'"
					:style="
						this.status === STATUS.LOADING_SRC
							? 'background-color:' + $colorList.white
							: $themeBackground
					"
					class="h-40 ripple rounded-1 px-3 white capsul-button  depth-2"
				>
					{{ btnText }}
				</view>
			</view>
		</view>
		<view class="px-3 pt-2">
			<view class="text-xs text-gray h-25 cuIcon-title">
				请在二维码出现后尽快付款，失效时间未知。
			</view>
			<view class="text-xs text-gray h-25 cuIcon-title">
				受小程序限制,无法在小程序内部直接识别外部二维码。
			</view>
			<view class="text-xs text-gray h-25 cuIcon-title">
				如果保存和预览均无法使用,请自行截图。
			</view>
			<view class="text-xs text-gray h-25 cuIcon-title">
				请在微信中确认支付结果，失败需重新下单结算。
			</view>
			<view class="text-xs text-gray h-25 cuIcon-title">
				成功支付后通常可在10分钟内到账。
			</view>
		</view>
		<tip ref="tip" />
		<modal ref="modal">
			<view class="p-5 bg-white">
				<image
					@tap="preview"
					class="gif-white response w-1 bg-white all-400 loading"
					:src="pay.src"
					mode="aspectFit"
				/>
			</view>
			<view class="animation-fade pl-3  bg-white">
				<view class="text-gray text-sm">订单号：</view>
				<view class="text-danger text-xl hg">{{ pay.orderId }}</view>
			</view>
			<view class="hg flex-row ">
				<view
					@tap="preview"
					:style="$themeBackground"
					class="text-white text-center flex-1 transition-2"
				>
					预览
				</view>
				<view @tap="storage" class="text-center flex-1">保存</view>
				<!-- <view @tap="storage" :disabled="!loaded" :class="loaded ? 'Btn' : 'disabledBtn'" class="text-white text-center flex-1 transition-2">
                {{ loaded ? '预览' : '获取中...' }}
            </view> -->
			</view>
		</modal>
		<modal ref="modal2">
			<scroll-view style="width:600rpx;height:770rpx;" scroll-y>
				<view class="px-3 mt-3 text-gray">本地记录获取过的订单(非付款账单)</view>
				<view
					class="hg px-3 flex-row j-sb border-bottom"
					v-for="(item, index) in payLog"
					:key="index"
				>
					<text :style="$themeFont">{{ item.orderId }}</text>
					<text>{{ item.time }}</text>
				</view>
			</scroll-view>
		</modal>
	</view>
</template>

<script>
import { APIs } from '@/staticData/staticData.js';
import { becomePromise, getStorageSync } from '@/commonFun.js';
const STATUS = {
	LOADING_INFO: 0,
	LOADED_INFO_SUCCESS: 1,
	LOADING_SRC: 2,
	LOADED_SRC_SUCCESS: 3,
	LOADED_INFO_FAILED: -1,
	LOADED_SRC_FAILED: -1
};
export default {
	data() {
		return {
			range: Array.from(
				{
					length: 5
				},
				(item, index) =>
					`${++index * 30}元 ，${index == 5 ? '6' : index}个月${
						index == 5 ? '(多送一个月)' : ''
					}`
			),
			multiple: 0,
			info: {
				account: '',
				remain: '',
				present: '',
				money: '',
				status: ''
			},
			pay: {
				orderId: '',
				src: 'https://image.weilanwl.com/gif/loading-1.gif',
				tempFilePath: ''
			},
			payLog: [], //{time:日期 + 时分,orderId:订单号}
			STATUS,
			status: STATUS.LOADING_INFO
		};
	},
	computed: {
		// gotInfo() {
		//     return this.info.account !== "";
		// },b
		money() {
			return (+this.multiple + 1) * 30;
		},
		btnText() {
			switch (this.status) {
				case STATUS.LOADING_SRC:
					return '自动获取中...';
				case STATUS.LOADED_SRC_SUCCESS:
					return '查看二维码';
				default:
					return '获取支付二维码';
			}
		},
		infoCN() {
			const info = this.info;
			return {
				账户: info.account,
				余额: info.money,
				状态: info.status,
				账号剩余月数: info.remain,
				还没使用赠送月数: info.present
			};
		}
	},
	mounted() {
		this.getInfo();
		this.payLog = getStorageSync('payLog', [], true);
	},
	methods: {
		slide(e) {
			this.multiple = e.detail.value;
		},
		async getInfo() {
			// const { ID: schoolId, password } = this.$account;
			try {
				this.$refs.tip.show('获取账户中');
				const { data: info } = await this.$http.post(APIs.getNetInfo, {
					schoolId: this.$education.ID,
					password: this.$unifiedPassword
				});
				for (let key in this.info) this.info[key] = info[key];
				this.status = STATUS.LOADED_INFO_SUCCESS;
			} catch (e) {
				console.log(e)
				if (e.data.error_code === 200) {
					this.$refs.tip.show('统一认证密码错误或账户被锁定');
				} else {
					this.$refs.tip.show('获取账户失败，可能与学校服务器关闭有关');
				}
				for (let key in this.info) this.info[key] = '无';
				this.info.account = '获取信息失败';
				this.status = STATUS.LOADED_INFO_FAILED;
			}
		},
		async storage() {
			if (this.status !== STATUS.LOADED_SRC_SUCCESS) return;
			try {
				if (this.pay.tempFilePath === '') {
					const { tempFilePath } = await becomePromise(
						uni.downloadFile,
						{
							url: this.pay.src
						},
						'下载二维码失败'
					);
					this.pay.tempFilePath = tempFilePath;
				}
				await becomePromise(
					uni.saveImageToPhotosAlbum,
					{
						filePath: this.pay.tempFilePath
					},
					'保存二维码失败'
				);
			} catch (e) {
				console.log(e);
				const msg = e[1];
				return this.$refs.tip.show(msg);
			}
			this.$refs.tip.show('保存成功，请尽快付款');
		},
		async open() {
			switch (this.status) {
				case STATUS.LOADING_INFO:
					this.$refs.tip.show('还未获取到账户信息，请稍等');
					break;
				case STATUS.LOADED_INFO_FAILED:
					this.$refs.tip.show('获取账户信息失败，无法缴费');
					break;
				case STATUS.LOADED_INFO_SUCCESS:
					this.status = STATUS.LOADING_SRC;
					await this.getImg();
					this.payLog.unshift({
						time: this.time(),
						orderId: this.pay.orderId
					});
					uni.setStorageSync('payLog', JSON.stringify(this.payLog));
					break;
				case STATUS.LOADED_SRC_SUCCESS:
					this.$refs.modal.showModal();
					break;
			}
		},
		async getImg() {
			try {
				const {
					data: { src, orderId }
				} = await this.$http.post(APIs.getPayImg, {
					schoolId: this.$education.ID,
					password: this.$unifiedPassword,
					months: this.multiple + 1
				});
				this.pay.src = src;
				this.pay.orderId = orderId;
				this.status = STATUS.LOADED_SRC_SUCCESS;
			} catch (e) {
				this.$refs.tip.show('获取付款二维码失败,请重试');
				this.status = STATUS.LOADED_INFO_SUCCESS;
			}
		},
		preview() {
			if (this.status === STATUS.LOADED_SRC_SUCCESS) {
				if (this.pay.tempFilePath === '') {
					uni.previewImage({
						urls: [this.pay.tempFilePath]
					});
				} else {
					becomePromise(uni.downloadFile, {
						url: this.pay.src
					})
						.then(({ tempFilePath }) => {
							this.pay.tempFilePath = tempFilePath;
							uni.previewImage({
								urls: [tempFilePath]
							});
						})
						.catch(err => this.$refs.tip.show('获取预览图片失败'));
				}
			}
		},
		openLog() {
			this.$refs.modal2.showModal();
		},
		time() {
			const date = new Date();
			return `${date.getMonth() +
				1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
		}
	}
};
</script>

<style scoped>
.disabledBtn {
	color: #fff;
	background-color: #a0cfff;
	border-color: #a0cfff;
}

.Btn {
	color: #fff;
	background-color: #409eff;
	border-color: #409eff;
}

.h-25 {
	height: 25px;
	line-height: 25px;
}

.h-40 {
	height: 40px;
	line-height: 40px;
}

.all-400 {
	height: 400rpx;
	width: 400rpx;
}
</style>
