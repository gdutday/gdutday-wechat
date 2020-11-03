<template>
	<view class="pb-5">
		<wave>
			<view class="userinfo flex-column a-center j-end">
				<view class="pb-2 mb-5 flex-column a-center j-center">
					<view class="userinfo-avatar">
						<!--  #ifdef MP -->
						<open-data type="userAvatarUrl"></open-data>
						<!--  #endif -->
						<!--  #ifndef MP -->
						<image class="all-1" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=208764926,3416618315&fm=26&gp=0.jpg"></image>
						<!--  #endif -->
					</view>
					<view class="text-center text-df hg">
						<!--  #ifdef MP -->
						<open-data type="userNickName"></open-data>
						<text>，你好呀</text>
						<!--  #endif -->
						<!--  #ifndef MP -->
						美好的一天，加油
						<!--  #endif -->
					</view>
				</view>
			</view>
		</wave>
		<view class="bg-white py-4 px-3 shadow-warp flex-row" style="height: 160rpx;">
            <!-- <view class="flex-1 h-1" v-for="i in 3" :key="i"></view> -->
            <!-- TODO 之后可能会删除 -->
            <view class="m-center">
                <view v-if="lastExam!=null" class="cuIcon-time mr-4 text-bold text-center" @tap="toExam" > {{ lastExam!=null?(lastExam.examCountDown>0?lastExam.examCountDown+"天后有":"今天有"):""}}{{lastExam!=null?lastExam.examSubject:""}}考试</view>
            </view>
        </view>
		<view v-if="delay" class="rounded-2 mx-5 mt-5 animation-slide-bottom depth-2">
			<button @tap="tapList(item.icon)" v-for="(item, index) in list" class="bg-white" :open-type="item.icon" :key="index">
				<view class="w-1 px hg flex-row j-sb">
					<view class="flex-row h-1 a-center">
						<image style="height: 20px;width: 20px;" class="myicon mr-2" :src="'/static/my_index/' + item.icon + '.png'" mode="" />
						<text>{{ item.text }}</text>
					</view>
					<view><text class="cuIcon-right icon text-right"></text></view>
				</view>
			</button>
		</view>
		<!-- <view class="text-lg text-blue" @tap="toGrade">{{ lastestGrade }}</view> -->
        <view class="flex-row">
            <text class="m-center text-center text-gray mt-5">v1.5.6@gdutday</text>
        </view>
    </view>
</template>

<script>
import wave from './wave.vue';
import { APIs } from '@/staticData/staticData.js';
import { wait,getLastExam } from '@/commonFun.js';
export default {
	components: {
		wave
	},
	onLoad() {
		// #ifdef MP
		uni.showShareMenu();
		// #endif
	},
	onShareAppMessage(res) {
		// 来自页面内转发按钮
		const isButton = res.from === 'button';
		// return {
		// 	title: isButton ? 'gdutday-转发课程' : '颜值超高的课表小程序-gdutday分享给你',
		// 	path: `/pages/schedule/schedule${isButton ? '?params=' + JSON.stringify(this.shareParams) : ''}`
		// };
        return {
        	title: '颜值超高的课表小程序-gdutday分享给你',
        	path: `/pages/schedule/schedule`
        };
	},
	onShareTimeline(){},
	data() {
		return {
            lastExam: null,
			list: [
				{
					icon: 'account',
					text: '账户与数据'
				},
				{
					icon: 'personal',
					text: '个性设置'
				},
				{
					icon: 'share',
					text: '转发给朋友'
				},
				// {
				// 	icon: 'selectionfill',
				// 	color: 'pink',
				// 	text: '赞赏我们'
				// },
				{
					icon: 'feedback',
					text: '意见反馈'
				},
				{
					icon: 'mark',
					text: '更新日志'
				},
				{
					icon: 'privacy',
					text: '用户服务条款'
				},
                {
					icon: 'task',
					text: '开发计划'
				},
                {
					icon: 'problem',
					text: '常见问题'
				},
				{
					icon: 'about',
					text: '关于我们'
				},
                {
                	icon: 'github',
                	text: '开源总览'
                }
			],
			delay:false
		};
	},
	created() {},
	async mounted() {
		uni.showLoading({
			title: '加载中'
		});
		await wait(300);
		uni.hideLoading();
		this.delay = true;
        this.lastExam = getLastExam();
	},
	computed: {
		iconColor() {
			return this.$allColor;
		}
	},
	methods: {
        toExam() {
            this.$Router.push({name:'exam'});
        },
		tapList(icon) {
			switch (icon) {
				case 'account':
					this.$Router.push({
						name: 'clear'
					});
					break;
				case 'personal':
					this.$Router.push({
						name: 'personalization'
					});
					break;
				// case '赞赏我们':
				//     break;
				case 'mark':
				    this.$Router.push({
				        name: 'mark'
				    });
				    break;
                case 'task':
                    this.$Router.push({
                        name: 'task'
                    });
                    break;
				case 'privacy':
					this.$Router.push({
						name: 'privacy'
					});
					break;
                case 'problem':
					this.$Router.push({
						name: 'problem'
					});
					break;
				case 'about':
					this.$Router.push({
						name: 'about'
					});
					break;
                case 'github':
                    this.$Router.push({
                        name: 'open'
                    });
                    break;
			}
		},
		toCode() {
			this.$Router.push({
				name: 'QR-Code'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.userinfo {
	position: relative;
	height: 100%;
	color: #fff;
}

.userinfo-avatar {
	overflow: hidden;
	display: block;
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	border: 2px solid #fff;
}

button:first-child {
	border-radius: 5px 5px 0px 0px;
}

button:last-child {
	border-radius: 0px 0px 5px 5px;
}

button {
	position: relative;
	font-size: 14px;
	border-radius: 0px;
	color: inherit !important;
}

button::after {
	position: absolute;
	border: none;
	border-radius: 0px;
}
</style>
