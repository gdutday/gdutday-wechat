<template>
	<confirm title="免责声明" confirm-text="我已知晓" @success="success" @fail="fail">
		<view class="cuIcon-title">校园网缴费功能，通过后台自动操作获取付款二维码，一步到位，免去您查找的困扰。请在二维码出现后尽快截图并返回微信使用扫一扫付款。</view>
		<view class="cuIcon-title">
			此功能仅为便捷功能，
			<text class="text-danger">您的资金不流经gdutday</text>
			，付款时请认准收款账户『
			<text class="text-danger">广东工业大学</text>
			』
		</view>
		<view class="cuIcon-title">
			请记录订单号(缓存将保存)，方便日后核对。
			<text class="text-danger">任何交易上的纠纷，与gdutday无关。</text>
		</view>
	</confirm>
</template>

<script>
export default {
	inject: ['Bus'],
	data() {
		return {};
	},
	methods: {
		fail() {
			this.Bus.hideModal();
        },
        success(){
			this.Bus.hideModal();
			uni.setStorageSync('payDeclear',true);
            this.$Router.push({name:'pay'});
        }
	}
};
</script>

<style></style>
