<template>
	<view class="cu-dialog depth-5" @tap.stop="" style="width:650rpx;">
		<view class="cu-bar bg-white"><view class="text-black text-center title w-1">个性设置</view></view>
		<view class="hg flex-row j-sb px-4">
			<view>背景设置</view>
			<view class="flex-row j-sb a-center" style="width:230rpx">
				<view @tap="del" class="backgroundButton text-center" style="border:#8799A3 solid 2rpx;">删除</view>
				<view @tap="change" :style="$themeBackground" class=" backgroundButton  text-white text-center">选择</view>
			</view>
		</view>
		<view class="hg flex-row j-sb px-4">
			<view>课程块透明度</view>
			<slider
				style="width:300rpx;margin: 0px;"
				@changing="sliderChangeing"
				@change="sliderChange"
				:activeColor="$colorList.theme"
				:block-color="$colorList.white"
				:value="opacity"
				:min="10"
				:block-size="20"
				:step="5"
				show-value
			/>
		</view>
		<!-- <view v-for="(item, index) in 3" :key="index" class="hg flex-row j-sb px-4"> -->
		<view v-for="(item, index) in 2" :key="index" class="hg flex-row j-sb px-4">
			<block v-if="index == 0">
				<view>课程字体颜色为白</view>
				<switch :checked="fontColor" @change="switchChange" :color="fontColor ? $colorList.theme : '#8799A3'" />
			</block>
			<block v-if="index == 1">
				<view>已完成课程灰度显示</view>
				<switch :checked="isPassedCourseBlockGray" @change="passedCourseGrayChange" :color="isPassedCourseBlockGray ? $colorList.theme : '#8799A3'" />
			</block>
			<!-- 	<block v-if="index == 2">
				<view>日程表为首页</view>
				<switch :checked="firstIndex" @change="firstIndexChanege" :color="firstIndex ? $colorList.theme : '#8799A3'" />
			</block> -->
		</view>
		<ripple>
			<view class="h-65  flex-row j-around a-center px-3">
				<view
					@tap="checkedColor(key)"
					v-for="(item, key) in allColor"
					:style="'background-image:linear-gradient(to right bottom,' + item.theme + ' 20%,' + item.dark + ' 80%)'"
					class="ripple white color-select flex-row j-center"
					:key="key"
				>
					<text class="cuIcon-check text-center text-lg" :style="'color:' + item.white" v-if="currentColor == key"></text>
				</view>
				<view @tap="toSelf" class="ripple white flex-row j-center a-center px" style="height: 85rpx;"><text class="cuIcon-more text-center text-xxl"></text></view>
			</view>
		</ripple>
	</view>
</template>

<script>
// import modal from '@/components/xing-modal.vue';
import changeSwiperComponent from '@/components/xing-swiper.js';
export default {
	components: {
		// modal
	},
	data() {
		return {
			// opacity:80
		};
	},
	inject: ['Bus'],
	computed: {
		opacity() {
			return this.$store.state.schedule.courseBlockOpacity;
		},
		fontColor() {
			return this.$store.state.schedule.isFontColorWhite;
		},
		isPassedCourseBlockGray() {
			return this.$store.state.schedule.isPassedCourseBlockGray;
		},
		firstIndex() {
			return this.$store.state.schedule.firstIndex;
		},
		currentColor() {
			return this.$store.state.themeColor;
		},
		allColor() {
			const _allColor = { ...this.$allColor };
			delete _allColor.otherTheme;
			return _allColor;
		}
	},
	methods: {
		async change(e) {
			this.$isShake ? uni.vibrateShort() : '';
			let becomePromise = this.$commonFun.becomePromise;
			try {
				const {
					tempFilePaths: [path]
				} = await becomePromise(uni.chooseImage, { count: 1 }, 'chooseImage');
				const { savedFilePath: newPath } = await becomePromise(uni.saveFile, { tempFilePath: path }, 'saveFile');
				const backgroundImage = this.$commonFun.getStorageSync('backgroundImage', '');
				if (backgroundImage != '') uni.removeStorageSync(backgroundImage);
				await becomePromise(uni.setStorage, { key: 'backgroundImage', data: newPath }, 'setStorage');
				this.setBackground(newPath);
			} catch (e) {
				if (e[1] == 'chooseImage') this.fail('系统不支持选择图片');
				else if (e[1] == 'saveFile') this.fail('保存图片失败');
				else if (e[1] == 'setStorage') this.fail('保存图片路径失败');
			}
		},
		fail(tip) {
			this.Bus.$refs['tip'].show(tip);
		},
		del(e) {
			uni.getStorage({
				key: 'backgroundImage',
				success: mes => {
					const { data = '' } = mes;
					uni.removeSavedFile({
						filePath: data,
						success: mes => {
							uni.setStorage({
								key: 'backgroundImage',
								data: '',
								complete: () => {
									this.Bus.$refs['tip'].show('删除背景成功');
								}
							});
						}
					});
				},
				complete: () => {
					this.Bus.hideModal('modal');
				}
			});
			this.Bus.$emit('setBackground', '');
		},
		passedCourseGrayChange(e) {
			this.$isShake ? uni.vibrateShort() : '';
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'isPassedCourseBlockGray',
				value: e.detail.value,
				toStorage: true
			});
		},
		firstIndexChanege(e) {
			this.$isShake ? uni.vibrateShort() : '';
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'firstIndex',
				value: e.detail.value,
				toStorage: true
			});
		},
		setBackground(newPath) {
			this.Bus.hideModal('modal');
			this.Bus.$emit('setBackground', newPath);
			this.Bus.$refs['tip'].show('设置背景成功, 如无法显示请压缩图片质量');
		},
		sliderChangeing(e) {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'courseBlockOpacity',
				value: e.detail.value
			});
		},
		sliderChange(e) {
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'courseBlockOpacity',
				value: e.detail.value,
				toStorage: true
			});
			// uni.setStorageSync('courseBlockOpacity',e.detail.value);
		},
		switchChange(e) {
			if (e.detail.value && this.$isShake) uni.vibrateShort();
			this.$store.commit({
				type: 'changeStateofSchedule',
				stateName: 'isFontColorWhite',
				value: e.detail.value,
				toStorage: true
			});
		},
		checkedColor(key) {
			if (key == this.currentColor) return;
			else {
				this.$store.commit({
					type: 'changeStateofGlobal',
					stateName: 'themeColor',
					value: key,
					toStorage: true
				});
				uni.removeStorage({ key: 'otherTheme' });
				this.Bus.$refs['tip'].show('主题更换成功, 部分组件重载后生效');
			}
		},
		toSelf(){
			this.$Router.push({
				name: 'personalization'
			});
		}
	}
};
</script>

<style scoped lang="scss">
.cu-dialog {
	.select {
		text-align: left;
		font-size: 18px;
		height: 50px;
		line-height: 50px;
	}
}
.backgroundButton {
	height: 52rpx;
	line-height: 52rpx;
	width: 96rpx;
	border-radius: 30rpx;
}
.h-65 {
	height: 65px;
	line-height: 65px;
}
.color-select {
	width: 75rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-radius: 50%;
}
</style>
