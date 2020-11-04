<template>
	<view>
		<cu-custom :isBack="true"><template v-slot:content>个性设置</template></cu-custom>
		<view class="hg px-5 flex-row bg-white j-sb">
			<view>
				<!-- <text class="cuIcon-writefill mr-1 text-xl"></text> -->
				主题颜色
			</view>
			<view class="ripple" :style="$themeFont">{{ colorName || '自定义' }}</view>
		</view>
		<ripple>
			<view class="h-65 bg-white flex-row j-around a-center px-3">
				<view
					@tap="checked(key)"
					v-for="(item, key, index) in allColor"
					:style="'background-image:linear-gradient(to right bottom,' + item.theme + ' 20%,' + item.dark + ' 80%)'"
					class="ripple white color-select flex-row j-center"
					:key="index"
				>
					<text class="cuIcon-check text-center text-lg" :style="'color:' + item.white" v-if="currentColor == key"></text>
				</view>
				<view @tap="toSelf" class="ripple white flex-row j-center a-center px" style="height: 85rpx;"><text class="cuIcon-more text-center text-xxl"></text></view>
			</view>
		</ripple>
		<ripple>
			<view class="hg flex-row j-sb px-5 bg-white">
				<view>开启震动</view>
				<switch :checked="$isShake" @change="shakeChange" :color="$isShake ? $colorList.theme : '#8799A3'" />
			</view>
		</ripple>
        <view class="hg px-5 flex-row bg-white j-sb">
        	<view>
        		<!-- <text class="cuIcon-writefill mr-1 text-xl"></text> -->
        		课表背景
        	</view>
        	<view class="ripple" :style="$themeFont">课表页面->➕->👔->背景设置</view>
        </view>
		<modal ref="modal"><color-picker @choose="choose"></color-picker></modal>
		<tip ref="tip"></tip>
		<t-color-picker v-if="reMount" ref="colorPicker" :color="defaultColor" @confirm="confirm">{{ description }}</t-color-picker>
	</view>
</template>

<script>
import colorPicker from '@/pages/my/my-personalization/color-picker/color-picker';
import tColorPicker from '@/components/t-color-picker/t-color-picker.vue';
export default {
	components: { colorPicker, tColorPicker },
	created() {},
	data() {
		return {
			nowKey: 'theme',
			reMount: true,
			defaultColor: {
				r: 255,
				g: 255,
				b: 255,
				a: 1
			},
			description: ''
		};
	},
	computed: {
		colorName() {
			const colorName = {
				cyan: '洋绿',
				red: '珊红',
				orange: '活力橙',
				pink: '桃粉',
				blue: '幽蓝',
				gray: '谧灰'
			};
			return colorName[this.$store.state.themeColor];
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
	//		created() {
	//		},
	//		mounted() {
	//		},
	//		beforeDestroy(){
	//		},
	methods: {
		toSelf() {
			// this.$Router.push({
			// 	name:'colorPicker'
			// })
			this.$refs.modal.showModal();
		},
		checked(key) {
			if (key == this.currentColor) return;
			else {
				this.$store.commit({
					type: 'changeStateofGlobal',
					stateName: 'themeColor',
					value: key,
					toStorage: true
				});
				uni.removeStorage({ key: 'otherTheme' });
				this.$refs['tip'].show('主题更换成功, 部分组件重载后生效');
			}
		},
		choose(e) {
			this.nowKey = e.key;
			this.description = e.description;
			this.defaultColor = this.rgbaToNumber(this.$colorList[this.nowKey]);
			this.reMount = false;
			this.$nextTick(() => {
				this.reMount = true;
				this.$nextTick(() => {
					this.$refs.colorPicker.open();
				});
			});
		},
		shakeChange(e) {
			e.detail.value ? uni.vibrateShort() : '';
			this.$store.commit({
				type: 'changeStateofGlobal',
				stateName: 'isShake',
				value: e.detail.value,
				toStorage: true
			});
		},
		confirm(e) {
			const rgba = this.toRGBA(e.rgba);
			if (rgba == this.$colorList[this.nowKey]) return false;
			const result = { ...this.$colorList };
			result[this.nowKey] = this.toRGBA(e.rgba);
			this.$store.commit('changeOtherTheme', result);
			this.$refs['tip'].show('自定义主题设置成功');
		},
		rgbaToNumber(string) {
			const str = string
				.split('(')[1]
				.split(')')[0]
				.split(',');
			return {
				r: +str[0],
				g: +str[1],
				b: +str[2],
				a: +str[3]
			};
		},
		toRGBA(str) {
			function handle(str) {
				str = +str;
				if (str == NaN || str > 255) return 255;
				else if (str < 0) return 0;
				return str;
			}
			return `rgba(${handle(str.r)},${handle(str.g)},${handle(str.b)},${handle(str.a * 255) / 255})`;
		},
		empty() {
			return false;
		}
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss">
.h-65 {
	height: 65px;
	line-height: 65px;
}
.color-select {
	width: 85rpx;
	height: 85rpx;
	line-height: 85rpx;
	border-radius: 50%;
}
</style>
