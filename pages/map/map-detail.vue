<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">{{title}}</block></cu-custom>
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
		
	},
	data() {
		return {
			article: '',
			title: 'title',
		};
	},
	async mounted() {
		console.log("mounted");
		const {
			data
		} = await this.$http.get("https://gdutday.gitee.io/textpage/text");
		console.log(data)
		this.article = marked(data)
	},
	methods: {
	}
};
</script>
<style>
</style>
