<template>
	<view class="h-100 bg-white flex-column">
		<cu-custom isBack>
			<template v-slot:content>
				已添加课程
			</template>
		</cu-custom>
		<block v-if="addClassDataLength === 0">
			<empty-tip />
		</block>
		<view class="hg border-bottom flex-row">
			<!-- <text @tap="navChange(index)" :style="i == index ? $themeFont : ''" class="text-center flex-1" v-for="(item, index) in ['课程', '日程']" :key="index">{{ item }}</text> -->
			<text @tap="navChange(index)" :style="i == index ? $themeFont : ''" class="text-center flex-1" v-for="(item, index) in ['课程']" :key="index">{{ item }}</text>
		</view>
		<!-- <xing-nav :shadow="true" :navItem="['课程', '日程']" :index="i" @change="navChange" :color="$colorList.theme" :selectedColor="$colorList.white" /> -->
		<swiper :current="i" @change="swiperChange" class="flex-1" :duration="500">
			<swiper-item>
				<view class="swiper-item">
					<block v-for="(item, index) in addClassData" :key="index">
						<view
							class=" flex-row w-1 a-center animation-fade animation-3"
							:style="'animation-delay:' + Math.log10(index + 1) * 150 + 'ms'"
							style="height: 60px;"
						>
							<view class="flex-row a-center flex-1">
								<view class="text-center hg" style="color: #C3C3C3;width: 50px;">{{ index + 1 }}</view>
								<view class="flex-column h-1 j-around flex-1" style="height: 40px;">
									<text class="text-df text-cut">{{ item.name }}</text>
									<text style="color: #C3C3C3;">{{ continuousWeek[index] + '周  ' + campusTime[item.start].start + '-' + campusTime[item.start + item.long].end }}</text>
								</view>
							</view>
							<text @tap="deleteClass(index)" class="ripple cuIcon-close mr-5 text-lg" />
							<!-- <view class="mr-5" style="width: 96rpx;">
								<view class="text-right text-df" :style="'color:' + item.color">{{ item.examPole }}</view>
								<view class="text-right text-sm" style="color: #C3C3C3;">{{ item.credit + '学分' }}</view>
							</view> -->
						</view>
					</block>
				</view>
			</swiper-item>
			<!-- <swiper-item><view class="swiper-item"> -->
			<!-- <block v-if="addClassDataLength === 0">
				<empty-tip />
			</block> -->
			<!-- </view></swiper-item> -->
		</swiper>
		<tip ref="tip" />
	</view>
</template>

<script>
import xingNav from '@/components/xing-nav.vue';
import { diffCampusTime } from '@/staticData/staticData.js';
function continuousNum(arr) {
	const res = [];
	const length = arr.length,
		last = length - 1;
	let start = arr[0];
	for (let i = 0; i < length; i++) {
		if (i === last || arr[i + 1] !== arr[i] + 1) {
			res.push([start, arr[i]]);
			start = arr[i + 1];
		}
	}
	return res;
}
export default {
	components: {
		xingNav
	},
	data() {
		return {
			i: 0
		};
	},
	computed: {
		addClassData() {
			return this.$store.state.schedule.addClassData;
		},
		addClassDataLength(){
			return this.addClassData.length;
		},
		campusTime() {
			return diffCampusTime[this.$store.state.schedule.campus];
		},
		continuousWeek() {
			return this.addClassData.map(item => {
				const numArr = continuousNum(item.week);
				const s = numArr.map(nums => (++nums[0] === ++nums[1] ? nums[0].toString() : nums[0] + '-' + nums[1])).join(',');
				return s;
			});
		}
	},
	methods: {
		navChange(index) {
			this.i = index;
		},
		swiperChange(e) {
			this.i = e.detail.current;
		},
		deleteClass(index) {
			this.$store.commit({
				type: 'changeAddClassData',
				handle: addClassData => {
					addClassData.splice(index, 1);
					this.$refs['tip'].show('删除课程成功');
				}
			});
		}
	}
};
</script>

<style></style>
