<template>
	<!-- 文本框 -->
	<view class="rapper" :style="width ? 'width:' + width + ';' : ''">
		<view style="height: 32px;"></view>
		<input
			class="myinput"
			@focus="focus"
			@blur="blur"
			:value="value"
			:type="_type"
			:maxlength="maxlength"
			:placeholder="place_1"
			:password="type === 'password'"
			@input="onInput"
		/>
		<view class="inputline" :style="'background-color:' + lineColor" :class="isfocus ? 'active' : ''"></view>
		<view class="tip" :class="_focus ? 'focus' : ''" :style="_focus ? 'color:' + textColor : ''">{{ tip }}</view>
		<!-- 是否可见密码 -->
		<!-- 倒计时 -->
		<!-- <view v-if="_isShowCode && !_isShowPass" :class="['vercode', { 'vercode-run': second > 0 }]" @click="setCode">{{ getVerCodeSecond }}</view> -->
		<view v-if="_isShowCode" :class="['vercode', { 'vercode-run': second > 0 }]" @click="setCode">{{ getVerCodeSecond }}</view>
		<view class="line"></view>
	</view>
</template>

<script>
var _this, countDown;
export default {
	data() {
		return {
			// showPassword: false, //是否显示明文
			second: 0, //倒计时
			isRunCode: false, //是否开始倒计时
			isfocus: false,
			timer: null,
			place_1: ''
		};
	},
	props: {
		value: {
			required: true
		},
		lineColor: {
			type: String,
			default: 'grey'
		},
		textColor: {
			type: String,
			default: 'grey'
		},
		type: {
			type: String,
			default: 'text'
		},
		width: {
			type: String
		},
		placeholder: String, //框内提示
		tip: {
			type: String,
			default: '用户'
		},
		maxlength: {
			//最大长度
			type: [Number, String],
			default: 20
		},
		// isShowPass: {
		// 	//是否显示密码图标（二选一）
		// 	type: [Boolean, String],
		// 	default: false
		// },
		isShowCode: {
			//是否显示获取验证码（二选一）
			type: [Boolean, String],
			default: false
		},
		codeText: {
			type: String,
			default: '获取验证码'
		},
		setTime: {
			//倒计时时间设置
			type: [Number, String],
			default: 60
		}
	},
	model: {
		prop: 'value',
		event: 'input'
	},
	mounted() {
		_this = this;
		//准备触发
		this.$on('runCode', val => {
			this.runCode(val);
		});
		clearInterval(countDown); //先清理一次循环，避免缓存
	},
	methods: {
		focus() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isfocus = true;
				this.place_1 = this.placeholder;
			}, 50);
		},
		blur() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isfocus = false;
				this.place_1 = '';
			}, 50);
		},
		// showPass() {
		// 	//是否显示密码
		// 	this.showPassword = !this.showPassword;
		// },
		onInput(e) {
			//传出值
			this.$emit('input', e.target.value);
		},
		setCode() {
			//设置获取验证码的事件
			if (this.isRunCode) {
				//判断是否开始倒计时，避免重复点击
				return false;
			}
			this.$emit('setCode');
		},
		runCode(val) {
			//开始倒计时
			if (String(val) == '0') {
				//判断是否需要终止循环
				this.second = 0; //初始倒计时
				clearInterval(countDown); //清理循环
				this.isRunCode = false; //关闭循环状态
				return false;
			}
			if (this.isRunCode) {
				//判断是否开始倒计时，避免重复点击
				return false;
			}
			this.isRunCode = true;
			this.second = this._setTime; //倒数秒数

			const _this = this;
			countDown = setInterval(function() {
				_this.second--;
				if (_this.second == 0) {
					_this.isRunCode = false;
					clearInterval(countDown);
				}
			}, 1000);
		}
	},
	computed: {
		_focus() {
			return this.isfocus || this.value != '';
		},
		_type() {
			//处理值
			const type = this.type;
			return type == 'password' ? 'text' : type;
		},
		// _isShowPass() {
		// 	//处理值
		// 	return String(this.isShowPass) !== 'false';
		// },
		_isShowCode() {
			//处理值
			return String(this.isShowCode) !== 'false';
		},
		_setTime() {
			//处理值
			const setTime = Number(this.setTime);
			return setTime > 0 ? setTime : 60;
		},
		getVerCodeSecond() {
			//验证码倒计时计算
			if (this.second <= 0) {
				return this.codeText;
			} else {
				if (this.second < 10) {
					return '0' + this.second;
				} else {
					return this.second;
				}
			}
		}
	}
};
</script>

<style scoped>
input {
	overflow: visible;
}
.rapper {
	font-size: 16px;
	position: relative;
}
/* .img {
	width: 16px;
	height: 32px;
	line-height: 32px;
	font-size: 16px;
	position: absolute;
	top: 64rpx;
	right: 0rpx;
} */
.myinput {
	outline: none;
	border: none;
	background: none;
	border-radius: 0 0 0 0;
	box-shadow: none;
	display: block;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 32px;
	color: rgba(0, 0, 0, 0.87);
	position: relative;
}
.inputline {
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 2px;
	background-color: grey;
	bottom: -0.5px;
	transform: scale(0, 1);
	transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}
.tip {
	color: #808080;
	position: absolute;
	height: 32px;
	line-height: 32px;
	top: 32px;
	left: 0px;
	transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}
.focus {
	font-size: 14px;
	transform: translateY(-32px);
}
.active {
	transform: scale(1, 1) !important;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #d1d1d1;
}
.vercode {
	color: rgba(0, 0, 0, 0.7);
	font-size: 24upx;
	line-height: 100upx;
}
.vercode-run {
	color: rgba(0, 0, 0, 0.4) !important;
}
.oBorder {
	border: none;
	border-radius: 2.5rem;
	-webkit-box-shadow: 0 0 60upx 0 rgba(43, 86, 112, 0.1);
	box-shadow: 0 0 60upx 0 rgba(43, 86, 112, 0.1);
}
</style>
