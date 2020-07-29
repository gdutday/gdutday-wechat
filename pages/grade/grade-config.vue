<template>
	<view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">选项</view></view>
		<ripple>
			<picker class="hg " mode="selector" :value="index" :range="cloudSelectTerms" @change="changeSelectTerms">
				<view class="hg px-5 flex-row bg-white j-sb">
					<view>学期范围</view>
					<text :style="$themeFont">{{ selectTerms }}</text>
				</view>
			</picker>
		</ripple>
		<ripple>
			<view class="hg flex-row j-sb px-5 bg-white">
				<view>包含公选课</view>
				<switch :checked="isIncludeOptionalCourse" @change="optionChange" :color="isIncludeOptionalCourse ? $colorList.theme : '#8799A3'" />
			</view>
		</ripple>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	inject: ['Bus'],
	computed: {
		grade() {
			return this.$store.getters.classifyGrade;
		},
		isIncludeOptionalCourse() {
			return this.$store.state.grade.isIncludeOptionalCourse;
		},
		selectTerms() {
			return this.$store.state.grade.selectTerms;
		},
		cloudSelectTerms() {
			const allTerms = ['大一上', '大一下', '大一全', '大二上', '大二下', '大二全', '大三上', '大三下', '大三全', '大四上', '大四下', '大四全'],
				end = 3 * parseInt(this.grade.length / 2) + (this.grade.length % 2),
				terms = allTerms.slice(0, end);
			terms.push('大学全');
			return terms;
		},
		index() {
			return this.cloudSelectTerms.findIndex(item => item == this.selectTerms);
		}
	},
	methods: {
		optionChange(e) {
			this.$isShake ? uni.vibrateShort() : '';
			this.$store.commit({
				type: 'changeStateofGrade',
				stateName: 'isIncludeOptionalCourse',
				value: e.detail.value,
				toStorage: true
			});
			this.Bus.$emit('changeGradeConfig');
		},
		changeSelectTerms(e) {
			this.$store.commit({
				type: 'changeStateofGrade',
				stateName: 'selectTerms',
				value: this.cloudSelectTerms[+e.detail.value],
				toStorage: true
			});
			this.Bus.$emit('changeGradeConfig');
		},
		terms() {}
	}
	//		created() {
	//		},
	//		mounted() {
	//		},
	//		beforeDestroy(){
	//		},
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
