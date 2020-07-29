<template>
	<view>
		<view class="rounded-2 mx-2 px-2 animation-slide-bottom text-white" :style="$themeBackground">
			<view class="text-df hg flex-row j-sb">
				<text>今日日程</text>
				<view class="flex-row j-sb">
					<text>{{'第' + (currentWeek+1) + '周'}}</text>
					<text class="ml-3">{{'星期' + dayCN}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
//	import from '@/'
	export default{
//		components:{},
//		props:{
//			:{
//				type:String,
//				default:'',
//			},
//		},
		data(){
			return{
				
			}
		},
		computed:{
			week() {
				return this.$store.state.schedule.week;
			},
			day() {
				return this.$store.state.schedule.day;
			},
			currentWeek() {
				return this.$currentWeek;
			},
			currentDay() {
				return this.$currentDay;
			},
			dayCN(){
				const day =  ['一','二', '三', '四', '五', '六', '日'];
				return day[this.currentDay];
			},
			classData() {
				return this.$store.state.schedule.classData;
			},
		},
//		created() {
//		},
//		mounted() {
//		},
//		beforeDestroy(){
//		},
		methods:{
			
		},
//		watch:{
//		},
	}
</script>
<style scoped lang="scss" >

</style>