<template>
	<view>
		<!-- <view class="position-fixed plugin leave" :class="index == 0 ? 'back' : ''"> -->
		<view class="position-fixed plugin leave back">
			<view @click="clickPlugin" :style="'background:' + $colorList.side" class="transition-5 button flex j-center a-center depth-4 active-shadow">
				<text :class="isPlgin ? 'rotate-45' : ''" class="cuIcon-add text-white button-text "></text>
			</view>
			<view v-if="live" class="position-absolute list w-1">
				<view
					v-for="(item, index) in listItems"
					class="item depth-5 "
					:class="isPlgin ? 'show' : ''"
					:style="'transition-delay:' + delay[index] + 'ms;'"
					:key="index"
					@tap="clickItem(index)"
				>
					<text :class="'cuIcon-' + item.icon" class="icon"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	inject: ['Bus'],
	data() {
		return {
			listItems: [
				{
					icon: 'clothesfill',
					key: 'background',
					isModal: true
				},
				{
					icon: 'noticefill',
					key: 'notice',
					isModal: true
				},
				{
					icon: 'add',
					key: 'add',
					isModal: false,
					operation:this.addSchedule
				}
			],
			isPlgin: false,
			live: false,
			isDisabled: false
		};
	},
	created() {
		this.Bus.$on('autoHidePlugin', this.atuoHidePlugin);
	},
	beforeDestroy() {
		this.Bus.$off('autoHidePlugin');
	},
	computed: {
		delay() {
			let arr = Array.from({ length: this.listItems.length }, () => 0);
			arr.forEach((item, index, array) => {
				arr[index] = this.isPlgin ? (arr.length - 1 - index) * 75 : index * 75;
			});
			return arr;
		},
		index() {
			return this.$store.state.schedule.index;
		}
	},
	methods: {
		clickItem(index) {
			// if (this.listItems[index] == 'add') this.Bus.$emit('addSchedule');
			// else
				this.Bus.showModal({
					type: this.listItems[index].isModal ? 'modal' : 'bottomModal',
					key: this.listItems[index].key
				});
				const operation = this.listItems[index].operation;
				operation&&operation();
			this.Bus.$emit('autoHidePlugin');
		},
		addSchedule(){
			this.Bus.$emit('addSchedule');
		},
		clickPlugin() {
			if (!this.isDisabled) {
				if (this.live) {
					this.$isShake ? uni.vibrateShort() : '';
					this.isPlgin = false;
					this.isDisabled = true;
					setTimeout(() => {
						this.live = false;
						this.isDisabled = false;
					}, 750);
				} else {
					this.$isShake ? uni.vibrateShort() : '';
					this.live = true;
					this.isDisabled = true;
					setTimeout(() => {
						this.isPlgin = true;
						this.isDisabled = false;
					}, 50);
				}
			}
		},
		atuoHidePlugin() {
			if (this.live) {
				this.clickPlugin();
			}
		}
	}
};
</script>

<style scoped lang="scss">
.plugin {
	right: 17.5px;
	bottom: 35px;
	z-index: 100;
	.list {
		bottom: 100%;
		.item {
			height: 40px;
			line-height: 40px;
			width: 40px;
			margin: 0 auto;
			margin-bottom: 10px;
			border-radius: 50%;
			background-color: #d1d3d4;
			text-align: center;
			opacity: 0;
			transition: opacity 0.25s ease-in;
			.icon {
				color: #606161;
				font-size: 24px;
			}
		}
		.show {
			opacity: 1;
		}
	}
	.button {
		// background-color: var(--side);
		height: 55px;
		line-height: 55px;
		width: 55px;
		border-radius: 50%;
		.button-text {
			font-size: 30px;
			transition: all 0.4s ease-out;
		}
	}
}
.rotate-45 {
	transform: rotate(-135deg);
}
// .ripple:after {
// 	background-image: radial-gradient(circle,#FFF 10%, transparent 10.01%) !important;
// 	border-radius:50% ;
// }
</style>
