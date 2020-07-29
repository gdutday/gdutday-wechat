<template>
	<!-- <view style="position: relative;"> -->
	<view class="myripple" id="ripple" @longtap="click" @tap="click">
		<slot></slot>
		<!--  0到10% 从无色渐变到#666 10%到10.1%从#666到无色  -->
		<view
			v-if="show && visibility"
			class="myrippleson"
			:style="
				'top:' +
					y +
					'px !important;left:' +
					x +
					'px !important;transform: scale(' +
					scale +
					');	background-image: radial-gradient( circle,' +
					color +
					'10%, transparent 10.1%);'
			"
		></view>
	</view>
	<!-- </view> -->
</template>

<script>
export default {
	props: {
		color: {
			type: String,
			default: 'rgba(0,0,0,.15)'
		},
		visibility: {
			default: true
		},
		white:{
			type:Boolean,
			default: false
		}
	},
	data() {
		return {
			position: {},
			x: 0,
			y: 0,
			scale: 0,
			mes: {},
			show: false
		};
	},
	mounted() {
		if(this.white) this.color = 'rgba(255,255,255,.3)'
		this.queryDom();
	},
	methods: {
		queryDom() {
			return this.$commonFun.reQueryDom('ripple', this).then(rect => {
				this.count(rect);
			});
		},
		count(rect) {
			this.mes = rect;
			this.position.x = rect.left + rect.width / 2;
			this.position.y = rect.top + rect.height / 2;
		},
		async click(e) {
			if (this.visibility) {
				if (!this.show) {
					this.show = true;
					this.click(e);
					return false;
				}
				this.queryDom();
				this.x = e.detail.x - this.position.x;
				this.y = e.detail.y - this.position.y;
				//取横向距边的最长距离
				const x = e.detail.x - this.mes.left >= this.mes.width / 2 ? e.detail.x - this.mes.left : this.mes.width - (e.detail.x - this.mes.left),
					//取纵向距边的最长距离
					y = e.detail.y - this.mes.top >= this.mes.height / 2 ? e.detail.y - this.mes.top : this.mes.height - (e.detail.y - this.mes.top),
					//取两边最长边
					scale = this.mes.width >= this.mes.height ? this.mes.width : this.mes.height;
				//放大倍数
				this.scale = (22 * parseFloat(Math.sqrt(x * x + y * y), 3)) / scale;
			}
			this.$emit('tap',e)
		}
	}
};
</script>

<style>
.myripple {
	/* 隐藏溢出的径向渐变背景 */
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}
.myrippleson {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	pointer-events: none;
	transform: scale(15);
	/* 设置径向渐变 */
	background-image: radial-gradient(circle, #666 10%, transparent 10.1%);
	background-repeat: no-repeat;
	opacity: 0;
	transition: transform 0.25s ease-in-out, opacity 0.8s ease-in-out;
}

.myripple:active .myrippleson {
	transform: scale(0) !important;
	/* //设置初始状态 */
	opacity: 1;
	transition: 0s;
}
</style>
