<template>
	<movable-area :style="'height:' + scrollHeight + 'px;width:100%'">
		<!-- :style="'height:' + (topHeight + 2 * scrollHeight) + 'px;width:100%;z-index:3'" -->
		<movable-view
			:style="
				'height:' +
					(topHeight + 1 * scrollHeight) +
					'px;width:100%;z-index:3'
			"
			direction="vertical"
			:out-of-bounds="true"
			:y="y"
			:disabled="status == 3"
			:damping="damping"
			@touchmove="touchmove"
			@touchstart="touchstart"
			@touchend="touchend"
			@change="change"
		>
			<view :style="'height:' + topHeight + 'px;position:relative'">
				<view style="position: absolute;bottom: 0px;" class="w-1">
					<extensions :interruptPosition="interruptPosition" />
				</view>
			</view>
			<view :style="'height:' + scrollHeight + 'px;'">
				<select-day />
				<view
					class="flex-row"
					:style="'height:' + (scrollHeight - 32) + 'px'"
					style="width: 750rpx;"
				>
					<view
						class="flex-column"
						:class="fontColor"
						style="width: 50rpx;border-radius: 25rpx;"
					>
						<view
							class="flex flex-1 a-center j-center"
							v-for="(item, index) in 12"
							:key="index"
						>
							{{ index + 1 }}
						</view>
					</view>
					<!-- <swiperoptimize v-if="reMountMark && delay" /> -->
					<swiperoptimize v-if="reMountMark" />
				</view>
			</view>
			<!-- <view :style="'height:' + scrollHeight + 'px;'"><slot name="bottom"></slot></view> -->
		</movable-view>
	</movable-area>
</template>

<script>
import swiperoptimize from '@/pages/schedule/schedule_content/schedule_components/class-swiper-optimize.vue';
import extensions from '@/pages/extensions/extensions.vue';
import selectDay from '@/pages/schedule/schedule_content/schedule_components/select-day.vue';
export default {
	components: {
		swiperoptimize,
		selectDay,
		extensions
	},
	props: {
		//耦合属性
		fontColor: {},
		// delay: {},
		reMountMark: {},
		//非耦合
		downLoading: {
			//控制下面下拉加载区的显示 , 默认关闭
			type: Boolean,
			default: false
		},
		scrollHeight: {
			//scroll显示区的高度(px)
			type: Number,
			default: 500
		},
		topHeight: {
			//下拉区的高度(px)
			type: Number,
			default: 60
		},
		interruptPosition: {
			//暂停区的高度(px)
			type: Number,
			default: 40
		},
		interruptBottomPosition: {
			type: Number,
			default: 50
		},
		triggleHeight: {
			type: Number,
			default: 40
		},
		damping: {
			//回弹动画的速度 , 值越大越快
			type: Number,
			default: 50
		},
		scrollTop: {
			//即scroll-top属性 设置竖向滚动条位置
			type: Number,
			default: 0
		},
		scrollAnimation: {
			type: Boolean,
			default: false
		}
	},
	inject: ['Bus'],
	data() {
		return {
			//耦合内容
			// interruptPosition: 2 * 73, //几行就几个73
			//原组件
			isTouch: false, //触摸的标识
			index: false,
			bottomStatus: false,
			y: 0, //控制y
			diff: 0, //定值topHeight-interruptPotion
			timeId: null,
			top: 0,
			status: 0,
			count: 0.01,
			scrollCount: 0.01,
			fingers: 0, //记录手指数
			clearFingers: null, //清除手指定时器
			backMove: 0,
			key: 1
		};
	},
	created() {
		this.init();
	},
	computed: {},
	methods: {
		init() {
			this.y = -this.topHeight + this.scrollCount;
			this.scrollCount = -this.scrollCount;
			this.diff = this.interruptPosition - this.topHeight;
		},
		change(e) {
			//为3即是正在回弹状态
			const {
				detail: { y }
			} = e;
			if (this.status == 3 || !this.isTouch) return;
			if (this.index) {
				//1 在下面
				const triggleHeight =
					-this.scrollHeight -
					this.topHeight +
					this.interruptBottomPosition;
				if (y >= triggleHeight) {
					this.indexStatus = 1;
				} else if (y < triggleHeight) {
					this.indexStatus = 0;
				}
			} else {
				const triggleHeight =
					-this.topHeight - this.interruptBottomPosition;
				//下拉y大 上拉y小
				if (y >= -this.triggleHeight || this.fingers > 1) {
					this.status = 2;
				} else if (y < -this.triggleHeight) {
					this.status = 1;
				}
				if (y <= triggleHeight) {
					this.indexStatus = 1;
				} else if (y > triggleHeight) {
					this.indexStatus = 0;
				}
			}
		},
		touchstart(e) {
			if (this.status == 3) {
				this.backMove = e.changedTouches[0].clientY;
			}
			this.fingers++;
			this.isTouch = true;
		},
		backTo() {
			this.y = -this.topHeight - 0.02;
			setTimeout(() => {
				this.$emit('finished');
				this.status = 0; //回弹过程中
				this.y = -this.topHeight; //结束之后，再次设置y坐标
			}, 200);
		},
		async touchend(e) {
			this.backMove = 0;
			clearTimeout(this.clearFingers);
			this.clearFingers = setTimeout(() => {
				this.fingers = 0;
				//重置手指数防止bug;
			}, 200);
			this.fingers--;
			if (this.status == 3 || this.fingers != 0) return; //防止多指下滑问题 , 匹配手指 只用到最后一次touchend;栈的思想
			this.isTouch = false;
			if (this.indexStatus) {
				this.indexStatus = 0;
				this.status = 3;
				if (this.index) {
					this.y = -this.topHeight + this.scrollCount;
				} else {
					this.y =
						-this.scrollHeight - this.topHeight + this.scrollCount;
				}
				this.scrollCount = -this.scrollCount;
				await this.$commonFun.wait(600);
				this.index = !this.index;
				this.status = 0;
			} else {
				if (this.index) {
					this.y =
						-this.scrollHeight - this.topHeight + this.scrollCount;
					this.scrollCount = -this.scrollCount;
				} else if (this.status == 2) {
					this.status = 3;
					this.y = this.diff;
					this.$emit('interrupt', this.backTo);
				} else if (this.status == 1) {
					this.status = 3;
					this.y = -this.topHeight + this.count;
					//微小改变 否则无响应
					this.count = -this.count;
					setTimeout(() => {
						this.status = 0; //回弹过程中
					}, 200);
				}
			}
		},
		touchmove(e) {
			if (
				this.status == 3 &&
				e.changedTouches[0].clientY - this.backMove < -5
			) {
				this.backTo();
			}
		}
	},
	watch: {
		status(value) {
			this.Bus.$emit('changeRefreshStaus', this.status);
			if (this.status == 2) this.$emit('pushToInterrupt');
			else if (this.status == 1) this.$emit('backToInterrupt');
		}
		// scrollTop() {
		// 	this.top = this.scrollTop;
		// }
	}
};
</script>

<style></style>
