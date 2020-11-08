<template>
	<view>
		<!-- <scroll-view class="w-1" scroll-x> -->
		<view
			class="px-5 flex-row box-content flex-wrap"
			:style="'height:' + interruptPosition + 'px;'"
		>
			<block v-for="(item, index) in icons" :key="index">
				<view
					@tap="open(item.operation)"
					style="width: 20%;white-space: nowrap;"
					class="flex-column j-around a-center overflow-hidden"
				>
					<view
						class="flex-column a-center j-center bg-white depth-3 active-shadow"
						style="width:40px;height:40px;border-radius:50%;"
					>
						<!-- <text :class="'cuIcon-' + item.icon" style="font-size: 30px;"></text> -->
						<image
							:src="'/static/extension/' + item.icon + '.png'"
							mode=""
							style="height: 28px;width: 28px;"
						/>
					</view>
					<text
						class="text-xxs"
						:class="hasBackground && fontColor ? 'text-white' : ''"
					>
						{{ item.description }}
					</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { getStorageSync, interceptToLogin, interceptToMyClear } from '@/commonFun.js';
import { APIs } from '@/staticData/APIs.js';
export default {
	inject: ['Bus'],
	props: {
		interruptPosition: {
			type: Number
		}
	},
	data() {
		return {
			icons: [
				{
					icon: 'QR',
					description: '入馆二维码',
					operation: this.openQR
				},
				{
					icon: 'book',
					description: '图书检索',
					operation: this.openLibrary
				},
				{
					icon: 'news',
					description: '校内新闻',
					operation: this.openNews
				},
				{
					icon: 'rubbish',
					description: '垃圾分类查询',
					operation: this.openRubbish
				},
				{
					icon: 'pay',
					description: '校园网缴费',
					operation: this.openPay
					// operation: this.openWaitFixing,
				},
				{
					icon: 'file',
					description: '资料查找',
					operation: this.openFile
				},
				{
					icon: 'map',
					description: '校园导览',
					operation: this.openMap
				},
				{
					icon: 'classroom',
					description: '空教室查询',
					operation: this.openWait
				},
				{
					icon: 'evaluate',
					description: '考试安排',
					operation: this.openExam
				}
				// {
				// image:'',
				//description
				// }
			]
		};
	},
	created() {},
	computed: {
		fontColor() {
			return this.$store.state.schedule.isFontColorWhite;
		},
		hasBackground() {
			return this.$store.state.schedule.hasBackground;
		}
	},
	methods: {
		async openWait() {
			uni.showToast({
				icon: 'none',
				title: '咕咕咕,在做了...'
			});
			await this.$commonFun.wait(1000);
			uni.hideToast();
		},
		async openWaitFixing() {
			uni.showToast({
				icon: 'none',
				title: '维护中...'
			});
			await this.$commonFun.wait(1000);
			uni.hideToast();
		},
		open(operation) {
			operation();
		},
		openExam() {
			if (this.$education.ID === 0) {
				return interceptToLogin(this.$Router);
			}else {
				this.$Router.push({
					name: 'exam'
				});
				
			}
		},
		openRubbish() {
			this.$Router.push({
				name: 'rubbish'
			});
		},
		openLibrary() {
			this.$Router.push({
				name: 'library'
			});
		},
		openNews() {
			this.$Router.push({
				name: 'news'
			});
		},
		openQR() {
			// if (this.$account.ID.length == 0 && this.$education.ID == 0)
			if (this.$education.ID === 0) return interceptToLogin(this.$Router);
			this.Bus.showModal({
				type: 'modal',
				key: 'QR'
			});
		},
		async openPay() {
			if (this.$education.ID === 0) {
				return interceptToLogin(this.$Router);
			} else if (this.$unifiedPassword.length === 0) {
				return interceptToMyClear(
					this.$Router,
					'您未设置统一认证平台密码(必需),请跳转至『账户与数据』点击『统一认证密码设置』进行设置'
				);
			} else {
				try {
					uni.showLoading({ title: '加载中', mask: true });
					const {
						data: { available }
					} = await this.$http.get(APIs.test, {
						timeout: 5000
					});
					uni.hideLoading();
					if (!available)
						return this.Bus.$refs.tip.show('学校网站维护中,请明天再试');
				} catch (e) {
					//TODO handle the exception
					uni.hideLoading();
					return this.Bus.$refs.tip.show('服务器错误');
				}
				const payDeclear = getStorageSync('payDeclear', false);
				if (!payDeclear)
					this.Bus.showModal({
						type: 'modal',
						key: 'pay'
					});
				else
					this.$Router.push({
						name: 'pay'
					});
			}
		},
		openMap() {
			uni.navigateTo({
				url: '/pages/map/map?fromHome=1'
			});
			//         this.$Router.push({
			//             name: "map",
			// query:{
			// 	fromHome:true,
			// },
			//         });
		},
		openFile() {
			this.$store.commit({
				type: 'changeStateofFile',
				stateName: 'templeItem',
				value: {
					pwd: '/',
					url: APIs.giteeDownloadRoot,
					name: '资料'
				}
			});
			this.$Router.push({
				name: 'file_0'
			});
		}
	}
	//		watch:{
	//		},
};
</script>

<style scoped lang="scss"></style>
