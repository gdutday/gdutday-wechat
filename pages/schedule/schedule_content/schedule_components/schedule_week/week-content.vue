<template>
	<view id="content" class="flex-row h-1 depth-3">
		<view @longpress.stop="addItem($event, index)" class="position-relative flex-1" style="margin:0 5rpx;" v-for="(item, index) in 7" :key="index">
			<block v-for="(nextItem, nextIndex) in resultData[index]" :key="nextIndex">
				<view
					class=" w-1 rounded-1 ripple position-absolute box-border active-shadow animation-fade fast "
					:class="isPassedCourseBlockGray[index][nextIndex] ? '' : 'depth-3'"
					:style="styleStr[index][nextIndex]"
					@tap="open(nextItem)"
					@longpress.stop="changeItem(nextItem)"
				>
					<view
						class="flex-column j-sb w-1 h-1 text-center middle box-border p  rounded-1"
						:class="fontColor ? 'text-white ' : 'text-black '"
						:style="
							isPassedCourseBlockGray[index][nextIndex]
								? 'background-color:rgba(192,192,192,.25);color:rgba(0,0,0,.3)!important;'
								: 'background-color:' + opacityColor[nextItem.color]
						"
					>
						<block v-if="nextItem.position != undefined">
							<view>
								<text class="text-xs" style="overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp:2;line-height: 14px;">
									{{ '考试:' + nextItem.name }}
								</text>
							</view>
							<view class="flex-1 flex-column" style="flex-direction:column-reverse;">
								<view class="text-xxs">{{ nextItem.classroom }}</view>
								<view class="text-xxs">{{ nextItem.start }}</view>
								<view class="text-xxs">{{ nextItem.splitdate }}</view>
							</view>
						</block>
						<block v-else>
							<view
								style="overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;line-height: 14px"
								:style="'-webkit-line-clamp:' + (nextItem.long * 2 - 1)"
							>
								<text class="text-xs">
									<text v-if="nextItem.isAdd" class="cuIcon-favorfill text-xs mr" />
									{{ nextItem.name }}
								</text>
							</view>
							<view class="text-xxs">{{ nextItem.classroom }}</view>
						</block>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { courseBlockColorListRGBA } from '@/staticData/staticData.js';
import { getWeek, reQueryDom } from '@/commonFun.js';
export default {
	components: {},
	props: {
		week: {
			type: Number,
			default: 0,
			required: true
		}
	},
	inject: ['Bus'],
	data() {
		return {
			colorList: courseBlockColorListRGBA,
			refreshStaus: 0
		};
	},
	computed: {
		isPassedCourseBlockGray() {
			const hasbeginTerm = getWeek() >= 0;
			if (this.$store.state.schedule.isPassedCourseBlockGray && hasbeginTerm) {
				if (this.week < this.$currentWeek) return this.resultData.map(item => item.map(() => true));
				else if (this.week > this.$currentWeek) return this.resultData.map(item => item.map(() => false));
				else {
					return this.resultData.map((item, index) => {
						return item.map(nextItem => {
							if (index < this.$currentDay) return true;
							else if (index > this.$currentDay) return false;
							else {
								const time = nextItem.start || this.$store.getters.thisCampusTime[+nextItem.begin - 1].start,
									now = new Date().getHours() + ':' + new Date().getMinutes();
								return this.$commonFun.computedTimeString(now, time, '-') > 0;
							}
						});
					});
				}
			} else {
				return this.resultData.map(item => (item = item.map(() => false)));
			}
		},
		resultData() {
			return this.$store.getters.courseData[this.week];
		},
		opacity() {
			return (this.$store.state.schedule.courseBlockOpacity / 100).toFixed(2);
		},
		opacityColor() {
			const opacity = this.opacity,
				opacityColor = {};
			Object.keys(this.colorList).forEach(item => {
				let str = this.colorList[item].split('');
				str.splice(-1, 0, ',' + opacity);
				opacityColor[item] = str.join('');
			});
			return opacityColor;
		},
		fontColor() {
			return this.$store.state.schedule.isFontColorWhite;
		},
		styleStr() {
			return this.resultData.map((item, index) => {
				return item.map((nextItem, nextIndex) => {
					if (nextItem.isExam) {
						const indexOf = this.$store.getters.thisCampusTime.map(item => item.start).indexOf(nextItem.start),
							isAftermoon = this.$commonFun.computedTimeString(nextItem.start, this.$store.getters.thisCampusTime[4].start, '-') >= 0,
							time = {
								start: isAftermoon ? this.$store.getters.thisCampusTime[4].start : this.$store.getters.thisCampusTime[0].start,
								end: isAftermoon ? this.$store.getters.thisCampusTime[8].end : this.$store.getters.thisCampusTime[3].end
							},
							long = this.$commonFun.computedTimeString(time.end, time.start, '-'),
							height = (this.$commonFun.computedTimeString(nextItem.end, nextItem.start, '-') * (isAftermoon ? 5 : 4)) / (12 * long);
						if (indexOf > -1) {
							return `height: calc(${height}*100%);top:calc(${indexOf}*100%/12);`;
						} else {
							const top = (this.$commonFun.computedTimeString(nextItem.start, time.start, '-') * (isAftermoon ? 5 : 4)) / (12 * long);
							return `height: calc(${height}*100%);top:calc(${(isAftermoon ? 4 : 0) / 12 + top}*100%)`;
						}
					} else {
						// return 'height: calc('+nextItem.long+'*100% / 12 - 10px);top:calc('+(nextItem.begin-1)+'*100%/12);margin:0px 0px 10px 0px;'
						return `height: calc(${nextItem.long}*100% / 12 - 10px);top:calc(${nextItem.begin - 1}*100%/12);margin:0px 0px 10px 0px;`;
					}
				});
			});
		}
	},
	inject: ['Bus'],
	created() {
		this.Bus.$on('changeRefreshStaus', status => (this.refreshStaus = status));
	},
	beforeDestroy() {
		this.Bus.$off('changeRefreshStaus');
	},
	methods: {
		open(item) {
			this.$isShake ? uni.vibrateShort() : '';
			this.Bus.$emit('openModal', item);
		},
		changeItem(item) {
			if (!item.isAdd) return;
			uni.vibrateShort();
			this.Bus.$emit('autoHidePlugin');
			this.Bus.showModal({
				type: 'bottomModal',
				key: 'add'
			});
			this.Bus.$emit('changeSchedule', item.addTag);
		},
		addItem($event, index) {
			if(this.refreshStaus > 1) return;
			let height = this.$store.state.schedule.height - 32;
			// #ifdef H5
			height = height - 50;
			// #endif
			const offsetTop = uni.getSystemInfoSync().windowHeight - height;
			const diff = $event.touches[0].clientY - offsetTop;
			const mutiply = Math.floor(diff / (height / 12));
			uni.vibrateShort();
			this.Bus.$emit('autoHidePlugin');
			this.Bus.showModal({
				type: 'bottomModal',
				key: 'add'
			});
			this.Bus.$emit('addSchedule', { week: [this.week], name: '', room: '', day: index, start: mutiply, long: 1 });
		},
		getMutiply($event) {},
		empty() {
			return;
		}
	}
};
</script>

<style scoped>
.fast {
	animation-duration: 0.25s;
}

/* .ripple:after {

background-image: radial-gradient(circle, #fff 10%, transparent 10.01%) !important;
} */
</style>
