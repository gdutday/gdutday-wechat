<template>
	<view class="px-5 mb overflow-hidden box-content transition-2 position-relative h-class" >
		<view class="flex-row j-sb">
		<view class="hg flex-row">
			<view class="capsul-button mr-2" @tap="triggle('class')" :style="!isItem ? 'background-color:' + $colorList.theme + ';color:white' : ''">课程</view>
			<!-- <view class="capsul-button mr-2 " @tap="triggle('item')" :style="isItem ? 'background-color:' + $colorList.theme + ';color:white' : ''">日程</view> -->
		</view>
		<text @tap="toDelete" :style="'color:' + $colorList.white" class=" hg-60">
			已添加课程
		</text>	
		</view>
		<view class="transition-2 bg-white position-absolute"  :style="isItem ? 'z-index:3;' :'opacity:0'">
			<plugin-add-course-item />
			<view style="height: 60px;"></view>
		</view>
		<view class="transition-2 bg-white position-absolute" :style="!isItem ? 'z-index:3;' :'opacity:0'">
			<plugin-add-course-class />
			<view style="height: 60px;"></view>
		</view>
	</view>
</template>

<script>
import pluginAddCourseClass from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-class/plugin-add-course-class.vue';
import pluginAddCourseItem from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-item/plugin-add-course-item.vue';
import { tmplIds } from '@/staticData/staticData.js';
export default {
	components: {
		pluginAddCourseClass,
		pluginAddCourseItem
	},
	inject: ['Bus'],
	data() {
		return {
			type: 'class',
			// itemHeight: 0,
			// courseHeight: 0,
			show: false
		};
	},
	computed: {
		isItem() {
			return this.type == 'item';
		},
		// heightString() {
			// let height = this.isItem&&this.itemHeight ? this.itemHeight : this.courseHeight;
			// if (this.itemHeight == 0 && this.courseHeight == 0) return '';
			// this.itemHeight && this.courseHeight ? (this.isItem ? this.itemHeight : this.courseHeight) : this.itemHeight || this.courseHeight;
			// return `height:${height&&(height + 50 + 60 )}px`;
		// },
		// diffHeight() {
		// 	return this.courseHeight - this.itemHeight;
		// }
	},
	methods: {
		triggle(e) {
			this.type = e;
		},
		toDelete(){
			this.$Router.push({name:'deleteCourse'})
		}
	},
	created() {
		this.Bus.$off('addSchedule');
		// this.Bus.$on('sendItemHeight', height => (this.itemHeight = height));
		// this.Bus.$on('sendCourseHeight', height => (this.courseHeight = height));
	},
	beforeDestroy() {
		this.Bus.$off('addSchedule');
		// this.Bus.$off('sendItemHeight');
		// this.Bus.$off('sendCourseHeight');
	}
	// #ifdef MP-WEIXIN
	// wx.requestSubscribeMessage({
	// 	tmplIds:tmplIds,
	// 	success:()=>{
	// 		// this.$refs.modal.showModal();
	// 	},
	// 	fail:(e)=>{
	// 		console.log(tmpIds);
	// 		console.log(e);
	// 		this.Bus.$refs['tip'].show('请通过订阅消息请求');
	// 	},
	// })
	//#endif
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss">
	.h-class{
		height: 400px;
	}
</style>
