<template>
	<view class="bg-white">
		<cu-custom isBack>
			<template v-slot:content>
				用户服务条款
			</template>
		</cu-custom>
		<view class="px-3"><uParse :content="article" /></view>
		<!-- <view class="px-3"><uParse @navigate="copyUrl" :content="article" /></view> -->
		<tip ref="tip" />
	</view>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue';
import { privacy } from '@/staticData/staticData.js';
export default {
	components: {
		uParse
	},
	data() {
		return {
			article: privacy
		};
	},
	methods: {
	}
};
</script>

<style></style>
