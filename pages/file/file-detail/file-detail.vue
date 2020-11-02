<template>
	<view style="height: 100vh;" class="flex-column bg-white">
		<cu-custom :isBack="unShare">
			<template v-slot:content>
				文件详情
			</template>
		</cu-custom>
		<view class="flex-column j-around flex-1">
			<view
				class="w-1 flex-column a-center"
				style="margin-top: 100px;padding: 0rpx 100rpx;"
			>
				<image :src="iconPath" style="height: 65px;width: 65px;" />
				<text class="text-df mt-4 mb-2">{{ name }}</text>
				<text class="text-sm text-gray">
					{{
						item.size < 10485
							? '小于0.01MB'
							: (item.size / 1048576).toFixed(2) + 'MB'
					}}
				</text>
			</view>
			<view class="flex-column a-center" style="padding: 0px 225rpx;">
				<button
					@tap="$refs.modal.showModal()"
					type="primary"
					:style="themeBorder + $themeBackground"
					class="w-1 mb-2"
				>
					打开
				</button>
				<button
					type="primary"
					open-type="share"
					:style="themeBorder + $themeFont"
					class="w-1 bg-white"
				>
					分享
				</button>
			</view>
		</view>
		<modal ref="modal" :round="true" :maskForce="isProgress">
			<block v-if="isProgress">
				<view
					class="cu-dialog  animation-fade bg-white animation-2"
					@tap.stop=""
					style="width:650rpx;"
				>
					<view class="cu-bar ">
						<view class="text-black text-center title w-1">直接打开文件</view>
					</view>
					<view class="text-gray text-sm w-1 text-center">
						正在获取文件中,请稍候...
					</view>
					<view class="hg px-4 flex-column j-center">
						<view
							class="w-1"
							style="height: 8px;background-color: #F6F7F9;border-radius: 4px;"
						>
							<view
								class="h-1 w-1 transition-1"
								style="transform-origin: left;border-radius: 4px;"
								:style="$themeBackground + loadingStr"
							/>
						</view>
					</view>
					<view class="text-gray text-sm w-1 text-right px-4">
						{{ bytesStr }}
					</view>
					<view
						@tap="cancel"
						class="hg text-df text-center"
						:style="$themeFont"
					>
						取消
					</view>
				</view>
			</block>
			<block v-else>
				<view class="cu-dialog " @tap.stop="" style="width:650rpx;">
					<block v-if="iconType != 'zip' && iconType != 'unknown'">
						<view style="height: 1px;background:#EBEBEB;"></view>
						<view @tap="openFile" class="hg flex-row text-df px-4">
							打开文件
						</view>
					</block>
					<view style="height: 1px;background:#EBEBEB;"></view>
					<view @tap="copyUrl" class="hg flex-row text-df  px-4">下载文件</view>
				</view>
			</block>
		</modal>
		<back-button />
		<tip ref="tip" />
	</view>
</template>

<script>
import { iconType } from '@/pages/file/file_commonFun.js';
import backButton from '@/pages/file/file_backButton.vue';
let task = null;
export default {
	components: {
		backButton
	},
	data() {
		return {
			url: '',
			type: '',
			name: '',
			size: 0,
			unShare: true,
			isProgress: false,
			progress: {
				progress: 0,
				totalBytesWritten: 0,
				totalBytesExpectedToWrite: 0
			}
		};
	},
	onShareAppMessage() {
		const query = {
			url: this.url,
			type: this.type,
			name: this.name,
			size: this.size,
			unShare: false
		};
		return {
			title: `gdutday向你分享${this.name}.${this.type}`,
			path: `/pages/file/file-detail/file-detail?query=${encodeURIComponent(
				JSON.stringify(query)
			)}` // 路径，传递参数到指定页面。
		};
	},
	onShareTimeline() {},
	onLoad(e) {
		const query = JSON.parse(decodeURIComponent(e.query));
		console.log(query)
		({
			url: this.url,
			type: this.type,
			name: this.name,
			size: this.size,
			unShare: this.unShare
		} = query);
	},
	computed: {
		iconType() {
			return iconType(this.type);
		},
		iconPath() {
			return `/static/file/${this.iconType}.png`;
		},
		themeBorder() {
			return `border:1px solid ${this.$colorList.theme};`;
		},
		loadingStr() {
			const progress = this.progress.progress || 0;
			return `transform: scaleX(${progress / 100});`;
		},
		bytesStr() {
			const written = (this.progress.totalBytesWritten / (1024 * 1024)).toFixed(2);
			const total = (
				this.progress.totalBytesExpectedToWrite /
				(1024 * 1024)
			).toFixed(2);
			return `${written}/${total}MB`;
		}
	},
	methods: {
		async openFile() {
			this.isProgress = true;
			task = uni.downloadFile({
				url: this.url,
				success: res => {
					this.hideModal('获取文件完成'), console.log('ok');
					uni.openDocument({
						filePath: res.tempFilePath,
						success: () => {
							setTimeout(() => (this.progress.progress = 0), 700);
						}
					});
				},
				fail: res => {
					console.log(res);
					const { errMsg } = res;
					setTimeout(
						() =>
							this.hideModal(
								errMsg.indexOf('abort') > -1
									? '已取消获取文件'
									: '获取文件失败,请检查网络'
							),
						700
					);
				}
			});
			task.onProgressUpdate(progress => {
				this.progress = progress;
			});
		},
		addRecent() {
			return this.$store.commit('unshiftRecentStack', {
				url: this.url,
				type: this.type,
				name: this.name,
				size: this.size,
				unShare: true
			});
		},
		cancel() {
			task.abort();
		},
		hideModal(tip) {
			setTimeout(() => (this.isProgress = false), 800);
			this.$refs.modal.hideModal();
			if (tip) this.$refs.tip.show(tip);
		},
		copyUrl() {
			this.addRecent();
			this.hideModal();
			uni.showModal({
				title: '提示',
				content: '因小程序储存限制,请在浏览器中粘贴链接下载',
				confirmColor: this.$commonFun.hexify(this.$colorList.theme),
				confirmText: '复制链接',
				success: e =>
					e.confirm &&
					uni.setClipboardData({
						data: this.url
					})
			});
		}
	}
};
</script>
