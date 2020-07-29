<template>
	<view>
		<image
			v-if="loading"
			class="position-absolute all-1 gif-white response position-center"
			src="https://image.weilanwl.com/gif/rhomb-white.gif"
			mode="aspectFit"
		/>
		<view v-else class="position-absolute all-1 gif-white response position-center">
			<view class="position-center gif-white response flex-column a-center ">
				<image style="height: 45px;" src="/static/empty.png" mode="aspectFit" />
				<text class="text-gray text-sm mt-2">{{tip}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		tip:{
			type: String,
			default:'这里什么都没有'
		},
		loading: {
			type:Boolean ,
			default: false
		}
	}
};
</script>

<style></style>
