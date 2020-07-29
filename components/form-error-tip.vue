<template>
	<view style="height: 80rpx;color: #e91e63;" class="flex-row a-center" >
		<view :style="showTip ? 'opacity:1;' : 'opacity:0;'" class="transition">
			<text class="cuIcon-warnfill"></text>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			showTip:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.transition {
	transition: all 0.5s ease;
}
</style>
