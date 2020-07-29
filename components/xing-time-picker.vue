<template>
	<view class="animation-fade" @animationend="query" style="width: 600rpx;">
		<view class="flex-row j-center a-center time-nav" :style="$themeBackground">
			<view class="flex-row" :style="'color:' + $colorList.white">
				<view class="hg" style="margin-right:80rpx;font-size: 60px;">
					<text :class="isMins ? '' : 'text-white'" @tap="changeMins(false)">{{ (Hours + (isPM ? 12 : 0)) % 24 }}</text>
					<text>:</text>
					<text :class="isMins ? 'text-white' : ''" @tap="changeMins(true)">{{ MinString }}</text>
				</view>
				<view class="text-lg flex-column j-sb">
					<text :class="isPM ? '' : 'text-white'" @tap="changeMoon(false)">AM</text>
					<text :class="isPM ? 'text-white' : ''" @tap="changeMoon(true)">PM</text>
				</view>
			</view>
		</view>
		<view class="flex-row j-center bg-white py-4">
			<view class="time-box">
				<view class="position-center center" style="height: 0px;width: 0px;" id="center"></view>
				<view
					class="pointer"
					:class="!isMins ? 'transition-2' : ''"
					:style="'transform:translateX(-50%) rotate(' + isWhich * (isMins ? 6 : 30) + 'deg);' + (isWhich == 0 || isWhich == 11 ? 'transition:0s' : '')"
				>
					<view style="height: 50%;width: 100%;"></view>
					<view class="pointer-inner" :style="$themeBackground"></view>
				</view>
				<view
					@touchstart="touch"
					@touchmove="touch"
					@touchend="touchEnd"
					v-for="(item, index) in 12"
					class="time-number"
					:style="'transform:translateX(-50%) scale(.94) rotate(' + index * 30 + 'deg)'"
					:key="index"
				>
					<text
						class="flex-row a-center j-center text-lg"
						style="height:30px;width:30px;border-radius:50%"
						:style="'transform:rotate(-' + index * 30 + 'deg);' + backgroundString[index]"
					>
						{{ isMins && index == 0 ? 0 : (index || 12) * (isMins ? 5 : 1) }}
					</text>
				</view>
			</view>
		</view>
		<view class="hg bg-white px-4 flex-row a-center j-around">
				<text class="text-df" @tap="confirm(false)">取消</text>
				<text class="text-df" :style="$themeFont" @tap="confirm(true)">确认</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isMins: false,
			Hours: 0,
			Mins: 0,
			center: [],
			now: [],
			isPM: false,
			throttle: false
		};
	},
	props: {
		hours: {
			type: Number,
			default: 0 // 12是0点, 0点是12点
		},
		mins: {
			type: Number,
			default: 0
		},
		isShake: {
			type: Boolean,
			default: true
		}
	},
	created() {
		this.Hours = this.hours % 12;
		this.isPM = this.hours >= 12;
		this.Mins = this.mins;
	},
	computed: {
		nowPI() {
			if (this.now.length == 0) return (this.Hours * 2 * Math.PI) / 12;
			return getAngle(this.center, [this.center[0],this.center[1] - 10], this.now);
		},
		backgroundString() {
			return Array.from({ length: 12 }, (item, index) => (index == (this.isMins ? this.Mins / 5 : this.Hours) ? 'color:#FFF;background-color:' + this.$colorList.theme : ''));
		},
		isWhich() {
			return this.isMins ? this.Mins : this.Hours;
		},
		MinString(){
			return ((this.Mins+'').length == 1 ? '0':'') + this.Mins
		}
	},
	methods: {
		confirm(e){
			if(e)
			this.$emit('outputTime',{
					hours:(this.Hours + (this.isPM ? 12 : 0))%24,
					mins:this.Mins
			})
			else
			this.$emit('cancel');
		},
		changeMoon(e) {
			this.isPM = e;
		},
		changeMins(e) {
			this.isMins = e;
		},
		query(){
			this.queryCenterPosition('center');
		},
		queryCenterPosition(position) {
			//查询起始位置
			const query = uni
				.createSelectorQuery()
				.in(this)
				.select('#' + position);
			query
				.boundingClientRect(res => {
					this[position] = [res.left, res.top];
					// console.log(arr);
				})
				.exec();
		},
		touch(e) {
			if (this.throttle) return false;
			this.now = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
			//节流
			this.throttle = setTimeout(() => (this.throttle = false), this.isMins ? 50 : 150);
		},
		touchEnd(e) {
			this.now = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
			clearTimeout(this.throttle);
			this.throttle = false;
		}
	},
	watch: {
		nowPI() {
			const percent = this.nowPI / (2 * Math.PI), //已成为百分比
				base_one = this.isMins ? 5 : 1,
				round = 12 * base_one,
				time = percent * round;
			let result = 0;
			Array.from({ length: round }, (item, index) => index).some((item, index) => {
				if (index == 0) {
					if ((time >= 0 && time <= 0.5) || (time > round - 0.5 && time < round)) {
						result = 0;
						return true;
					}
				} else if (time > index - 0.5 && time <= index + 0.5) {
					result = index;
					return true;
				}
			});
			return this.isMins ? (this.Mins = result) : (this.Hours = result);
		},
		Hours(newValue, oldValue) {
			if ((!newValue && oldValue == 11) || (newValue == 11 && oldValue == 0)) this.isPM = !this.isPM;
		},
		Mins(oldValue, newValue) {
			if (oldValue == 30 && newValue == 29) this.Mins = 30;
		},
	}
};
function getAngle(cen, first, second, bug) {
	// cen  : 中心点 [0,0]
	// first : 开始点 [1,3]
	// second : 结束位置 [3,4]
	var f_c_x = first[0] - cen[0],
		f_c_y = cen[1] - first[1],
		s_c_x = second[0] - cen[0],
		s_c_y = cen[1] - second[1];
	var c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y) * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
	if (c == 0) return -1;
	let s = (f_c_x * s_c_x + f_c_y * s_c_y) / c;
	if (cen[0] - second[0] <= 0 && cen[1] - second[1] > 0) {
		// 第二象限
		return Math.acos(s);
	} else if (cen[0] - second[0] <= 0 && cen[1] - second[1] < 0) {
		return Math.acos(s);
		// 第一象限
		return Math.acos(s);
	}  else if (cen[0] - second[0] > 0 && cen[1] - second[1] <= 0) {
		// 第三象限
		return Math.acos(-s) + Math.PI;
	} else if (cen[0] - second[0] >= 0 && cen[1] - second[1] > 0) {
		// 第四象限
		return Math.acos(-s) + Math.PI;
	}
}
</script>

<style scoped lang="scss">
.time-nav {
	height: 100px;
}
.time-box {
	box-sizing: content-box;
	width: 450rpx;
	height: 450rpx;
	border-radius: 50%;
	background: #ededed;
	position: relative;
	.time-number {
		height: 100%;
		position: absolute;
		left: 50%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.pointer {
		height: 100%;
		width: 2px;
		position: absolute;
		top: 0px;
		left: 50%;
		display: flex;
		flex-direction: column-reverse;
		.pointer-inner {
			position: relative;
			width: 100%;
			height: 38%;
			&:after {
				content: '';
				position: absolute;
				background-color: inherit;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
}
</style>
