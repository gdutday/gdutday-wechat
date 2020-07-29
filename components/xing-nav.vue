<template>
	<scroll-view :class="shadow ? 'depth-2' : ''" scroll-x style="height: 80rpx;" :style="'background-color:' + color" class="nav transiton-2 text-white" scroll-with-animation :scroll-into-view="scrollCenter">
		<view :id="'navitem' + i" @tap="tabSelect(i)" class="item" :style="i == index ? 'color:' + selectedColor : ''" v-for="(item, i) in navItem" :key="i">
			<view class="all-1">{{ item }}</view>
		</view>
		<view class="position-relative" style="height: 5rpx;">
			<view
			class="rounded text-white  h-1 position-absolute transition-2"
			:style="lineStr"
			></view>
		</view>
	</scroll-view>
</template>

<script>
//	import from '@/'
export default {
	//		components:{},
	props: {
		navItem: {
			type: Array,
			required: true
		},
		//必须手动更新索引 index即为要更新的索引
		index: {
			type: Number,
			required: true
		},
		color: {
			type: String,
			default: '#0DA7A5'
		},
		selectedColor: {
			type: String,
			default: '#C1E8E2'
		},
		shadow:{
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
			tabDelay:null,
			center:0
		};
	},
	created() {
		this.change();
	},
	computed: {
		scrollCenter() {
			return 'navitem' + this.center;
		},
		isLeft(){
			return this.index * 100.03;
		},
		lineStr(){
			return 	`width:100.1rpx;background:${this.selectedColor};transform:translateX(${this.isLeft}rpx);`
		}
	},
	methods: {
		tabSelect(index) {
			this.$emit('change', {
				detail: {
					index: index
				}
			});
		},
		change(){
			if (this.index < 4) {
				this.center = 0;
			} else if (Math.abs(this.index - (this.center + 3)) > 2) {
				this.center = this.index - 3;
			}
		}
	},
	watch: {
		index() {
			clearTimeout(this.tabDelay);
			this.tabDelay = setTimeout(() => {
				this.change();
			}, 400);
		}
	}
};
</script>
<style scoped>
.nav {
	white-space: nowrap;
}
.item {
	height: 75rpx;
	line-height: 75rpx;
	width: 100.1rpx;
	text-align: center;
	display: inline-block;
	box-sizing: border-box;
	transition: all 0.1s ease-in-out 0s;
}
</style>
