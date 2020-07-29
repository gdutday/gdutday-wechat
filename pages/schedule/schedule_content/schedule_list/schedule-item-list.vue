<template>
	<view>
		<view class="cu-timeline" v-for="(item, index) in schuduleData" :key="index">
			<view class="cu-time">{{ item.time }}</view>
			<view class="cu-item">
				<view :style="$themeBackground" class="content my text-white">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
//	import from '@/'
export default {
	//		components:{},
	//		props:{
	//			:{
	//				type:String,
	//				default:'',
	//			},
	//		},
	data() {
		return {
			schuduleData:[],
		};
	},
	computed: {},
	//		created() {
	//		},
	//		mounted() {
	//		},
	//		beforeDestroy(){
	//		},
	methods: {}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
