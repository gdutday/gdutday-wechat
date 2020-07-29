<template>
	<view class="cu-dialog depth-5" @tap.stop="no" style="width: 600rpx;">
		<block v-if="isExam">
			<view class="title px-2">{{ '考试 : ' + examData.name }}</view>
			<view class="flex-column">
				<view class="px-2 hg flex-row j-sb">
					<view>考试地点</view>
					<view>{{ examData.classroom || '无' }}</view>
				</view>
				<view class="px-2 hg flex-row j-sb">
					<view>考试时间</view>
					<view>{{ examData.start + '-' + examData.end }}</view>
				</view>
				<view class="px-2 hg flex-row j-sb">
					<view>考试日期</view>
					<view>{{ examData.date }}</view>
				</view>
				<view class="px-2 hg flex-row j-sb">
					<view>考试座位</view>
					<view>{{ examData.position + '号' }}</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="title px-2">{{ modalData.name }}</view>
			<view class="flex-column">
				<view class="px-2 hg flex-row j-sb">
					<view>上课地点</view>
					<view>{{ modalData.classroom || '无' }}</view>
				</view>
				<view class="px-2 hg flex-row j-sb">
					<view>上课时间</view>
					<view>{{ modalData.time }}</view>
				</view>
				<view v-if="modalData.teacher" class="px-2 hg flex-row j-sb">
					<view>授课老师</view>
					<view>{{ modalData.teacher }}</view>
				</view>
				<view class="px-2 flex-row j-sb">
					<view class="hg">上课内容</view>
					<view style="width: 70%;" class="flex-column j-center">
						<view class="w-1 flex-row a-center j-end">
							<view @tap="toMore" :class="isMore ? '' : 'wrap-polyfill-3'" class="text-right overflow-hidden ">{{ modalData.content || '无说明' }}</view>
							<!-- <view @tap="toMore" class="text-right overflow-hidden " :style=" isMore ? '' : 'wrap-3' ">{{ modalData.content || '无说明' }}</view> -->
						</view>
						<view v-if="!isMore && contentLength > 45" class="text-right">...</view>
						<view v-if="!isMore && contentLength > 45" class="text-right text-xxs text-gray">(有省略点击可展开)</view>
					</view>
				</view>
				<view v-if="modalData.addTag" class="px-2 flex-row" style="justify-content: flex-end;">
					<view class="">
						<button class="button-nostyle hg-60" open-type="share"><text class="text-lg text-info cuIcon-forwardfill" /></button>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
// import modal from '@/components/xing-modal.vue';
import { diffCampusTime } from '@/staticData/staticData.js';
export default {
	components: {
		// modal
	},
	data() {
		return {
			isMore: false,
			modalData: {
				time: '',
				classroom: '',
				teacher: '',
				content: '',
				name: '',
				addTag: 0
			},
			examData: {
				start: '',
				end: '',
				position: '',
				name: '',
				classroom: '',
				date: ''
			},
			isExam: false
		};
	},
	computed: {
		contentLength() {
			return this.modalData.content.length;
		}
	},
	inject: ['Bus'],
	created() {
		// this.Bus.$on('showNotice', () => this.autoOpenClassMessage());
		// this.Bus.$off('showNotice');
		this.Bus.$on('openModal', dataset => {
			if (dataset.position != undefined) {
				this.isExam = true;
				({
					end: this.examData.end,
					start: this.examData.start,
					date: this.examData.date,
					position: this.examData.position,
					classroom: this.examData.classroom,
					name: this.examData.name
				} = dataset);
			} else {
				this.isExam = false;
				({
					content: this.modalData.content,
					teacher: this.modalData.teacher,
					classroom: this.modalData.classroom,
					name: this.modalData.name,
					addTag: this.modalData.addTag
				} = dataset);
				//设置转发参数
				const { addTag } = this.modalData;
				if (this.modalData.addTag) {
					const classData = this.$store.state.schedule.addClassData.find(classData => classData.addTag === addTag);
					this.Bus.$emit('changeShareParams', classData);
				}
				this.modalData.time =
					this.$store.getters.thisCampusTime[parseInt(dataset.begin) - 1].start +
					'-' +
					this.$store.getters.thisCampusTime[parseInt(dataset.long) + parseInt(dataset.begin) - 2].end;
			}
			this.$nextTick(() => {
				this.Bus.showModal({
					type: 'modal',
					key: 'classDetail'
				});
				this.isMore = false;
			});
		});
	},
	beforeDestoryed() {
		this.Bus.$off('openModal');
	},
	methods: {
		toMore() {
			this.isMore = !this.isMore;
		},
		no() {}
	},
	watch: {}
};
</script>

<style scoped>
.wrap-polyfill-3 {
	/*line-height和height要相互配合，显示多少行就省略，就是line-height多少倍数*/
	line-height: 1.2em;
	max-height: 3.6em;
	/*此属性看需求来判断是否设置，因为设置了padding-right，多腾出了点位置，该值一般为padding-right的值的负值*/
	/* margin-left: -1em; */
	/*此值写死成1em就好，因为省略号大概就是占用1em的空间*/
	/* text-align: justify; */
	overflow: hidden;
}
</style>
