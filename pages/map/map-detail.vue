<template>
	<view class="bg-white minh-100">
		<cu-custom :isBack="true"><block slot="content">{{title}}</block></cu-custom>
		<empty-tip v-if="article === ''" loading></empty-tip>
		<view v-else class="px-3"><uParse :content="article" /></view>
		<go-to-button :location="location" :name="title"></go-to-button>
	</view>
</template>

<script>
import marked from 'marked';
import uParse from '@/components/gaoyia-parse/parse.vue';
import { APIs } from '@/staticData/staticData.js';
import goToButton from './goToButton.vue';
export default {
	components: {
		uParse,
		goToButton
	},
	onLoad(e) {
		const name = decodeURIComponent(e.name);
		const location = decodeURIComponent(e.location);
		this.title = name
		this.location = location
		console.log(this.location)
	},
	data() {
		return {
			article: '',
			title: 'title',
			location: ''
		};
	},
	async mounted() {
		let markdown = ''
		try {
			const {
				data
			} = await this.$http.get(APIs.details + this.title);
			markdown = data
		}catch(e){
			if (+e.statusCode == 404) {
				markdown = "# 没有数据"
			}
		};
		this.article = marked(markdown)
	},
	methods: {
	}
};
</script>
<style>
</style>
