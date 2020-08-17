<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">{{title}}</block></cu-custom>
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
	onLoad(e) {
		console.log("onLoad")
		const name = decodeURIComponent(e.name);
		const location = decodeURIComponent(e.location);
		this.title = name
		this.location = location
		console.log(this.location)
	},
	async created() {
		console.log("created")
		// const {
		// 	data: { html }
		// } = await this.$http.get(APIs.update);
		// this.article = html;
		this.article = "# hello"//marked("# hello")
	},
	data() {
		return {
			article: '',
			title: 'title',
		};
	},
	methods: {
	}
};
</script>
<style>
</style>
