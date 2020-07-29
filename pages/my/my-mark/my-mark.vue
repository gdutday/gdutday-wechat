<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">更新日志</block></cu-custom>
		<empty-tip v-if="article === ''" loading></empty-tip>
		<view v-else class="px-3"><uParse :content="article" /></view>
	</view>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	components: {
		uParse
	},
	async created() {
		const {
			data: { html }
		} = await this.$http.get(APIs.update);
		this.article = html;
	},
	data() {
		return {
			article: ''
		};
	},
	methods: {
	}
};
</script>
<style></style>
