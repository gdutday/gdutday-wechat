<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">开发计划</block></cu-custom>
		<empty-tip v-if="article === ''" loading></empty-tip>
		<view v-else class="px-3"><uParse :content="article" /></view>
	</view>
</template>

<script>
import marked from 'marked';
import uParse from '@/components/gaoyia-parse/parse.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	components: {
		uParse
	},
	async created() {
		let markdown = ''
		try {
			const {
				data
			} = await this.$http.get(APIs.task);
			markdown = data
		}catch(e){
			if (+e.statusCode == 404) {
				markdown = "# 没有数据"
			}
		};
		this.article = marked(markdown)
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
