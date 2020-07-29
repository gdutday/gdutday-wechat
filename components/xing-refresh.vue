<template>
		<movable-area :style="'height:' + scrollHeight + 'px;width:100%'">
			<movable-view
				:style="'height:' + (topHeight + scrollHeight) + 'px;width:100%;z-index:3'"
				direction="vertical"
				:out-of-bounds="true"
				:y="y"
				:disabled="!scrollmark || status == 3"
				:damping="damping"
				@touchmove="touchmove"
				@touchstart="touchstart"
				@touchend="touchend"
				@change="change"
			>
				<view :style="'height:' + topHeight + 'px;position:relative'">
					<view style="position: absolute;bottom: 0px;" class="w-1">
						<slot name="top"></slot>
					</view>
				</view>
				<scroll-view
					:style="'height:' + scrollHeight + 'px;'"
					:scroll-y="status !== 3"
					:scroll-with-animation="scrollAnimation"
					:scroll-top="top"
					@scroll="scroll"
					@scrolltolower="scrolltolower"
				>
					<view>
						<slot name="content"></slot>
						<template v-if="downLoading">
							<slot name="bottom"></slot>
						</template>
					</view>
				</scroll-view>
			</movable-view>
		</movable-area>
</template>

<script>
export default {
	props: {
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
		triggleHeight:{
			type:Number,
			default:40
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
		},
		
	},
	data() {
		return {
			isTouch: false, //触摸的标识
			y: 0, //控制y
			diff: 0, //定值topHeight-interruptPotion
			scrollmark: true,
			timeId: null,
			top: 0,
			status: 0,
			count: 0.01,
			scrollCount: 0.01,
			fingers: 0, //记录手指数
			clearFingers: null ,//清除手指定时器
			backMove:0,
			key: 1,
		};
	},
	created() {
		this.init();
	},
	methods: {
		init(){
			this.y = -this.topHeight + this.scrollCount;
			this.scrollCount = -this.scrollCount;
			this.diff = this.interruptPosition - this.topHeight;
		},
		change(e) {
			//为3即是正在回弹状态
			if (this.status == 3 || !this.isTouch) return;
			if (e.detail.y >= -this.triggleHeight || this.fingers > 1) {
				this.status = 2;
			} else if (e.detail.y < -this.triggleHeight) {
				this.status = 1;
			}
		},
		touchstart(e) {
			if(this.status == 3) {
				this.backMove = e.changedTouches[0].clientY;
			}
			this.fingers++;
			this.isTouch = true;
		},
		backTo(){
			this.y = -this.topHeight - 0.02;
			setTimeout(() => {
				this.$emit('finished');
				this.status = 0; //回弹过程中
				this.y = -this.topHeight; //结束之后，再次设置y坐标
			}, 200);
		},
		touchend(e) {
			this.backMove = 0;
			clearTimeout(this.clearFingers);
			this.clearFingers = setTimeout(() => {
				this.fingers = 0;
				//重置手指数防止bug;
			}, 200);
			this.fingers--;
			if (this.status == 3 || this.fingers != 0) return; //防止多指下滑问题 , 匹配手指 只用到最后一次touchend;栈的思想
			this.isTouch = false;
			if (this.scrollmark) {
				if (this.status == 2) {
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
		touchmove(e){
			if(this.status == 3&&(e.changedTouches[0].clientY - this.backMove ) < -5){
				this.backTo();
			}
		},
		scroll(e) {
			//事件
			this.$emit('scroll', e);
			clearTimeout(this.timeId);
			this.scrollmark = false;
			this.timeId = setTimeout(() => {
				if (e.detail.scrollTop <= 15 || e.detail.scrollTop - e.detail.deltaY <= 0) {
					this.top = 0 + this.count;
					this.$emit('scrolltoupper', e);
					this.scrollCount = -this.scrollCount;
					this.scrollmark = true;
				}
			}, 100);
		},
		scrolltolower(e) {
			this.$emit('scrolltolower', e);
		}
	},
	watch: {
		status(value) {
			if (this.status == 2) this.$emit('pushToInterrupt');
			else if (this.status == 1) this.$emit('backToInterrupt');
		},
		scrollTop() {
			this.top = this.scrollTop;
		},
	}
};
</script>

<style></style>
