<template>
	<view style="border-radius: 4px;">
		<!-- 按钮 -->
		<ripple :visibility="visibility">
			<button @tap="tap" :disabled="_rotate" :class="['buttonBorder', !_rotate ? 'dlbutton' : 'dlbutton_loading']" :style="{ background: bgColor, color: fontColor }">
				<view :class="_rotate ? 'rotate_loop' : ''">
					<text v-if="_rotate" class="cuIcon cuIcon-loading1 "></text>
				</view>
				<text>{{ text }}</text>
			</button>
		</ripple>
	</view>
</template>

<script>
export default {
	props: {
		text: String, //显示文本
		rotate: {
			//是否启动加载
			type: [Boolean, String],
			default:false
		},
		bgColor: {
			//按钮背景颜色
			type: String,
			default: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))'
		},
		fontColor: {
			//按钮字体颜色
			type: String,
			default: '#FFFFFF'
		}
	},
	data(){
		return{
			visibility:true,
		}
	},
	methods:{
		tap(e){
			this.$emit('buttonTap',e);
		}
	},
	computed: {
		_rotate() {
			//处理值
			return String(this.rotate) !== 'false';
		}
	},
	watch:{
		rotate(){
			setTimeout(()=>this.visibility = !this.rotate,500)
		}
	}
};
</script>

<style scoped>
.dlbutton {
	color: #ffffff;
	font-size: 30upx;
	height: 100upx;
	background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6));
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14), 0 1px 14px 0 rgba(0, 0, 0, 0.12);
	line-height: 100upx;
	text-align: center;
}
.dlbutton_loading {
	color: #ffffff;
	font-size: 30upx;
	height: 100upx;
	box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
	line-height: 100upx;
	text-align: center;
}
.buttonBorder {
	border: none;
	border-radius: 4px;
	-webkit-box-shadow: 0 0 60upx 0 rgba(0, 0, 0, 0.2);
	-webkit-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
	-moz-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
	-ms-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
	-o-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
	transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
}

/* 旋转动画 */
.rotate_loop {
	-webkit-transition-property: -webkit-transform;
	-webkit-transition-duration: 1s;
	-moz-transition-property: -moz-transform;
	-moz-transition-duration: 1s;
	-webkit-animation: rotate 1s linear infinite;
	-moz-animation: rotate 1s linear infinite;
	-o-animation: rotate 1s linear infinite;
	animation: rotate 1s linear infinite;
}
@-webkit-keyframes rotate {
	from {
		-webkit-transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(360deg);
	}
}
@-moz-keyframes rotate {
	from {
		-moz-transform: rotate(0deg);
	}
	to {
		-moz-transform: rotate(359deg);
	}
}
@-o-keyframes rotate {
	from {
		-o-transform: rotate(0deg);
	}
	to {
		-o-transform: rotate(359deg);
	}
}
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(359deg);
	}
}
</style>
