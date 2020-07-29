<template>
	<view class="p-5 bg-white" style="border-radius: 10rpx;">
		<view class="hg text-center">请置于图书馆闸机前</view>
		<QR :val="$account.ID + ''" :size="300" :onval="true" ref="code" :showLoading="false" />
	</view>
</template>
<script>
import QR from '@/components/tki-qrcode/tki-qrcode.vue';
export default {
	components: {
		QR
	},
	inject: ['Bus'],
	props: {},
	data() {
		return {};
	},
	mounted() {
		this.$refs.code._makeCode();
	},
	methods: {
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
