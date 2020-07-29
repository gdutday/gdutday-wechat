<template>
	<view style="margin-bottom: -10rpx;" class="bg-white flex-row px-5 pt-2 flex-wrap j-center qiun-common-mt ">
		<block v-for="(item, index) in gradeMessage" :key="index">
			<view style="height: 15px;" class="flex-row a-center j-center mb-1 mr-2">
				<view class="h-1 mr" style="width: 15px;" :style="'background-color:' + item.color"></view>
				<view style="font-size: 12.5px;">{{ item.examTerm + '(' + item.examTime + ')' }}</view>
			</view>
		</block>
	</view>
</template>
<script>
import commonFun from '@/pages/grade/grade-common-fun.js';
export default {
	data() {
		return {};
	},
	computed: {
		gradeMessage() {
			return this.$store.getters.termsGrade.map((item, index) => {
				return {
					examTime: item.examTime,
					examTerm: item.examTerm,
					color: commonFun.colors[index]
				};
			});
		}
	}
};
</script>
<style scoped lang="scss"></style>
