<template>
	<view class="bg-white h-100">
		<cu-custom isBack>
			<template v-slot:content>
				豆瓣读书
			</template>
		</cu-custom>
		<view v-if="!loading" class="mt-2 px-3 flex-row">
			<image
				:src="image"
				class="mr-3 rounded loading"
				style="width: 210rpx;height: 300rpx;"
			/>
			<view class="flex-column flex-1">
				<view class=""></view>
				<view class=""></view>
			</view>
		</view>
		<empty-tip v-else :loading="loading" />
	</view>
</template>

<script>
import { http } from '@/axios-config.js';
import { doubianBook, APIs } from '@/staticData/APIs.js';
import { d } from './helper.js';
export default {
	data() {
		return {
			data: {},
			loading: true,
			bookData:d.bookData
		};
	},
	computed:{
		image(){
			return this.data.image === 'https://img1.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-lpic.gif'
			? this.bookData.JdCover
			: this.data.image
		},
	},
	async onLoad({ query: Isbn }) {
		console.log(d.bookData);
		// #ifdef MP
		Isbn = decodeURI(Isbn);
		// #endif
		Isbn = Isbn.split('"')[1];
		const { data } = await http.get(doubianBook(Isbn));
		this.$set(this, 'data', data);
		this.loading = false;
		const {
			data: { counts, comments }
		} = await http.get(APIs.douban.comments, {
			params: {
				page: '1',
				id: data.id
			}
		});
		console.log(comments);
	},
	methods: {
		// handleAnnotations(annotations) {
		// 	return annotations.map(annotation => {
		// 		return {
		// 			author_user: annotation.author_user,
		// 			chapter: annotation.chapter,
		// 			summary: annotation.summary,
		// 			content: JSON.parse(annotation.content),
		// 			time: annotation.time,
		// 			page_no: annotation.page_no,
		// 			photos: annotation.photos
		// 		};
		// 	});
		// }
	}
};
</script>

<style></style>
