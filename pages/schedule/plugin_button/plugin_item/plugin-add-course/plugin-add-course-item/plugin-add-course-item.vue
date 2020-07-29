<template>
	<view id="item" style="width: 650rpx;">
		<view class="flex-row j-sb">
			<input class="text-df" style="width:550rpx;" type="text" :focus="focus" placeholder="准备做什么?" v-model="title" />
			<view class="text-df" :style="$themeFont">添加</view>
		</view>
		<view class="hg" @tap="openTimePicker">
			<text class="cuIcon-time mr-1"></text>
			<text :style="time.hours!=null ? $themeFont : ''">{{ timeString }}</text>
		</view>
		<view class="hg" @tap="openRepeat">
			<text class="cuIcon-refresh mr-1"></text>
			<text :style="time.mins ? $themeFont : ''">{{ '设置重复' }}</text>
		</view>
	</view>
</template>
<script>
export default {
	//		props:{
	//			:{
	//				type:String,
	//				default:'',
	//			},
	//		},
	inject: ['Bus'],
	data() {
		return {
			title: '',
			time: {
				hours: null,
				mins: null
			},
			focus: false
		};
	},
	computed: {
		timeString() {
			if (this.time.hours != null) return `${this.time.hours} : ${((this.time.mins + '').length == 1 ? '0' : '') + this.time.mins}`;
			else return '设置时间';
		}
	},
	created() {
		this.Bus.$on('timePick', this.getTime);
		
	},
	beforeDestroy() {
		this.Bus.$off('timePick');
	},
	mounted() {
		this.query();
	},
	methods: {
		getTime(e) {
			this.time.hours = e.hours;
			this.time.mins = e.mins;
		},
		openTimePicker() {
			this.Bus.showModal({
				type:'modal',
				key:'timePicker'
			})
		},
		openRepeat() {
			this.Bus.showModal({
				type:'modal',
				key:'repeat'
			})
		},
		query(){
			this.$commonFun.reQueryDom('item',this).then((res)=>{
				this.Bus.$emit('sendItemHeight',res.height);
			}).catch((res)=>{});
		},
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
