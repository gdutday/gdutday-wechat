<template>
	<view class="bg-white" style="min-height: 100vh;">
		<custom-input :focus="true" v-model="value" placeholder="输入科目名"><block slot="content">全部科目成绩</block></custom-input>
		<view class="">
			<block v-for="(item, index) in filterGrade" :key="index">
				<view class="ripple flex-row w-1 a-center animation-fade animation-3" :style="'animation-delay:' + Math.log10(index + 1) * 150 + 'ms'" style="height: 60px;">
					<view class="flex-row a-center flex-1">
						<view class="text-center hg" style="color: #C3C3C3;width: 50px;">{{ index + 1 }}</view>
						<view class="flex-column h-1 j-around flex-1" style="height: 40px;">
							<text class="text-df text-cut">{{ item.examName }}</text>
							<text style="color: #C3C3C3;">{{ item.examTime }}</text>
						</view>
					</view>
					<view class="mr-5" style="width: 96rpx;">
						<view class="text-right text-df" :style="'color:' + item.color">{{ item.examPole }}</view>
						<view class="text-right text-sm" style="color: #C3C3C3;">{{ item.credit + '学分' }}</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import customInput from '@/components/custom-input.vue';
export default {
	components: {
		customInput
	},
	//		props:{
	//			:{
	//				type:String,
	//				default:'',
	//			},
	//		},
	data() {
		return {
			value: ''
		};
	},
	computed: {
		grade() {
			return this.$store.getters.gradeAddColor;
		},
		filterGrade() {
			if (this.value === '') return this.grade;
			else return this.grade.filter(item => item.examName.indexOf(this.value) > -1);
		},
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var height = uni.upx2px(80);
			var style = `height:${CustomBar + height}px;padding-top:${StatusBar}px;`;
			return style;
		}
	},
	methods: {
		BackPage() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
