<template>
		<view class="day row w-1 position-relative" style="height: 80rpx;z-index: 100;box-shadow: 1px 2px 2px rgba(0,0,0,.3);" 
		>
			<view
				@tap="unfold"
				:style="'width: 49.5rpx;'"
				class="text-center flex-column justify-around text-white"
			>
				<ripple :color="'rgba(255,255,255,.3)'">
					<view class="h-1 flex j-center a-center"><text :class="isFold ? '' : 'unfold'" class="cuIcon-right transiton-2 text-center"></text></view>
				</ripple>
			</view>
			<view style="" class="row flex-1 position-relative ">
				<view 
				class="row text-xs w-1 day" :class="[isFold ? '' : 'opacity']">
					<view :style="'color:' + $colorList.white" class="flex-1 box-border a-center j-center text-center flex-column justify-around ">第{{ week + 1 }}周</view>
					<view
						v-for="(item, index) in 6"
						:key="index"
						class=" flex-1 box-border a-center j-center text-center text-white flex-column justify-around"
					>
						{{ '周' + date[index] }}
					</view>
				</view>
				<scroll-view
					@touchstart="clear"
					@touchend="set"
					scroll-x
					style="z-index: 10;height: 80rpx;"
					:class="[isFold ? 'fold' : '']"
					class="position-absolute nav transiton-2 text-white"
					scroll-with-animation
					:scroll-into-view="scrollCenter"
				>
					<view
						class="cu-item"
						:id="'navitem' + index"
						:style="index == week ? 'color:' + $colorList.white : ''"
						style="height: 75rpx;line-height: 75rpx;padding: 0px;width: 100.1rpx;"
						v-for="(item, index) in long"
						:key="index"
						@tap="tabSelect"
						:data-id="index"
					>
						<view class="all-1">{{ index + 1 }}周</view>
					</view>
					<view style="height: 5rpx;position:relative ;">
						<view class="rounded text-white  h-1 position-absolute transiton-2" :style="'width:100.1rpx;	background:'+ $colorList.white +';transform:translateX(' + isLeft + 'rpx);'"></view>
					</view>
				</scroll-view>
			</view>
		</view>
</template>

<script>
export default {
	data() {
		return {
			date: ['二', '三', '四', '五', '六', '日'],
			center: 0,
			long: 20,
			isFold: true,
			tabDelay: null,
			foldTime: null,
			isLeft: 0
		};
	},
	props: {},
	inject: ['Bus'],
	computed: {
		scrollCenter() {
			return 'navitem' + this.center;
		},
		week() {
			return this.$store.state.schedule.week;
		},
		hasBackground() {
			return this.$store.state.schedule.hasBackground;
		},
		fontColor() {
			return this.$store.state.schedule.isFontColorWhite;
		},
	},
	created() {
		this.isLeft = this.week * 100.03; //精度问题
	},
	methods: {
		clear() {
			clearTimeout(this.foldTime);
		},
		set() {
			this.foldTime = setTimeout(() => {
				this.isFold = true;
			}, 3500);
		},
		unfold(e) {
			clearTimeout(this.foldTime);
			this.isFold = !this.isFold;
		},
		tabSelect(e) {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'week',
				value: +e.currentTarget.dataset.id
			})
			this.Bus.$emit('autoHidePlugin');
		}
	},
	watch: {
		week() {
			clearTimeout(this.foldTime);
			this.isFold = false;
			this.foldTime = setTimeout(() => {
				this.isFold = true;
			}, 3500);
			this.isLeft = this.week * 100.03;
			clearTimeout(this.tabDelay);
			this.tabDelay = setTimeout(() => {
				if (this.week < 4) {
					this.center = 0;
				} else if (Math.abs(this.week - (this.center + 3)) > 2) {
					this.center = this.week - 3;
				}
			}, 400);
		}
	}
};
</script>

<style scoped>
.transiton-2 {
	transition: all 0.25s ease-in-out;
}
.unfold {
	transform: rotate(-180deg);
}
.fold {
	width: 0px;
}
.day{
	opacity: 1;
	transition: opacity .3s ease;
	transition-delay: .2s;
}
.opacity{
	opacity: 0;
	transition-delay: 0s;
}
</style>
