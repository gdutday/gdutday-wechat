<template>
	<view class="bg-white flex-column" style="min-height: 100vh;">
		<custom-input
			cancel
			@cancel="cancel"
			@focus="focus"
			@blur="blur"
			v-model="value"
			placeholder="搜索广工图书馆馆藏,书名,作者,出版社"
		>
			<template v-slot:content>
				图书检索
			</template>
		</custom-input>
		<view class="position-relative flex-1">
			<view
				@tap="showHistory = !showHistory"
				v-if="showHistory"
				class=" px-3 position-absolute z-index_3000 all-1 animation-3 animation-fade"
				style="background-color: rgba(0,0,0,.3);"
			>
				<scroll-view
					scroll-y
					class="w-1 mt-1 bg-white rounded-1 pb-1"
					style="max-height:700rpx;"
				>
					<view
						@tap="deleteAllHistory"
						class="hg-70 w-1 px-2 text-df border-bottom flex-row j-sb"
						style="color: #343A40;"
					>
						<text>清除历史记录</text>
						<text class="cuIcon-delete"></text>
					</view>
					<view
						@tap.stop="searchHistory(item)"
						v-for="(item, index) in searchBookHistory"
						class="j-sb flex-row hg-60 px-2 w-1 text-sm  text-gray"
						:key="index"
					>
						<text>{{ item }}</text>
						<text
							@tap.stop="deleteHistory(index)"
							class="cuIcon-close"
						></text>
					</view>
					<text
						class="text-center text-gray"
						v-if="MaxPages > 1 && pageIndex == MaxPages"
					>
						没有更多了~
					</text>
				</scroll-view>
			</view>
			<block v-if="value != ''">
				<view
					v-if="bookData.bookList.length == 0"
					class="position-full"
				>
					<empty-tip :loading="loading" tip="什么都没搜到" />
				</view>
				<block v-else>
					<view class="text-gray px-3 hg-70">
						共找到{{ bookData.FindCount }}本书
					</view>
					<view
						class=" animation-fade animation-3"
						:style="
							'animation-delay:' +
								Math.log10(index + 1) * 150 +
								'ms'
						"
						v-for="(item, index) in bookData.bookList"
						:key="index"
					>
						<view class="flex-row">
							<img
								class="mt-2 loading"
								style="width:200rpx;height:200rpx"
								:src="
									item.JdCover === ''
										? defaultImg
										: item.JdCover
								"
							/>
							<view class="pr-3 pl-1 flex-1 text-cut">
								<view class="text-df hg-70 text-cut">
									{{ item.Title }}
								</view>
								<view class="w-1 line-8 text-cut">
									<view class="text-gray text-xs text-cut">
										{{ item.Author }}
									</view>
									<view class="text-gray text-xs text-cut">
										{{ item.Publish }}
									</view>
									<view class="text-gray text-xs">
										{{ item.Isbn }}
									</view>
								</view>
							</view>
						</view>
						<view class="w-1 flex-row py-2 text-gray">
							<view
								@tap="openPlace(item.CtrlNo)"
								class="flex-1 text-center"
							>
								<text class="cuIcon-location" />
								<text class="ml-1">馆藏</text>
							</view>
							<view
								style="background-color: #A0A0A0;width: 1px;"
							/>
							<view
								@tap="toDouban(item)"
								class="flex-1 flex-row j-center a-center"
							>
								<view
									style="width: 14px;height: 14px;background-image: url(/static/doubian.png);background-size: cover;"
								/>
								<text class="ml-1">豆瓣读书</text>
							</view>
						</view>
					</view>
				</block>
			</block>
			<view v-else class="pt-2 px-3">
				<view class="hg text-lg">热门关键字</view>
				<view>
					<view
						v-for="(item, index) in recommendList"
						:style="
							'animation-delay:' +
								Math.log10(index + 1) * 150 +
								'ms;' +
								$themeFont
						"
						:key="index"
						@tap="clickKey(item)"
						class="hg-60 display-inline-block rounded-1 text-df animation-fade animation-3 mt-2 mr-2 px-2 item_tip"
					>
						{{ item }}
					</view>
				</view>
			</view>
		</view>
		<modal ref="modal" :round="true">
			<view class="px-2 pt-2 flex-column a-center">
				<uParse :content="article" />
			</view>
		</modal>
		<tip ref="tip"></tip>
	</view>
</template>

<script>
import customInput from '@/components/custom-input.vue';
import {
	findBookPramer,
	bookPlacePrammer,
	bookDetailPramer,
	APIs
} from '@/staticData/APIs.js';
import { getStorageSync, throttle, wait } from '@/commonFun.js';
import uParse from '@/components/gaoyia-parse/parse.vue';
import { d } from './helper.js';
export default {
	components: {
		customInput,
		uParse
	},
	data() {
		return {
			value: '',
			article: '无',
			bookData: {
				FindCount: 0,
				bookList: []
				// 	 "RowNo":"2",
				// "CtrlNo":"770687",
				// "CtrlRd":"VHDIOWLPQ3",//查询位置用到
				// "BookNo":"0",
				// "BookRd":"",
				// "IsoCount":"0",
				// "SublibDis":"00100",
				// "Title":"微信小程序：设计发布+营销运营+成交转化+应用案例",
				// "Isbn":"ISBN:978-7-302-50643-0",
				// "Author":"王艺编著",
				// "Publish":"2018 出版 / 清华大学出版社",
				// "PublishC":"清华大学出版社",
				// "PublishD":"2018 出版",
				// "JdCover":""
			},
			showHistory: false,
			loading: false,
			throttle: null,
			isFocus: false,
			pageIndex: 1,
			recommendList: [],
			searchBookHistory: [],
			defaultImg: 'http://wap.zhaobenshu.com/img/wx/ic_cover.png'
		};
	},
	onLoad() {
		// #ifdef MP
		uni.showShareMenu();
		// #endif
	},
	onReachBottom() {
		this.addList();
	},
	created() {
		this.$http
			.get(APIs.getRecommendBook)
			.then(
				({ data: { stvisitkey_ifa_GetList_list1: recommendList } }) => {
					this.recommendList = recommendList.map(item => item.Keys);
				}
			);
		this.searchBookHistory = getStorageSync('searchBookHistory', [], true);
	},
	computed: {
		HistoryLength() {
			return this.searchBookHistory.length;
		},
		MaxPages() {
			return Math.floor(this.bookData.FindCount / 100) + 1;
		}
	},
	methods: {
		tap(item) {
			this.$refs.modal.showModal();
		},
		cancel() {
			this.value = '';
		},
		searchHistory(item) {
			this.value = item;
			this.showHistory = false;
		},
		async openPlace(id) {
			uni.showLoading({
				title: '获取中'
			});
			try {
				const { data } = await this.$http.get(bookPlacePrammer(id));
				this.article = data.split('"OpacColl":"')[1].split(`"})`)[0];
				await wait(200);
				this.$refs.modal.showModal();
			} catch (e) {
				this.$refs.tip.show('获取失败');
			}
			uni.hideLoading();
		},
		toDouban(item) {
			// console.log(Isbn);
			const { Isbn } = item;
			if (Isbn === '' || Isbn === undefined) {
				return this.$refs.tip.show('暂时无此图书信息');
			}
			d.bookData = item;
			this.$Router.push({
				name: 'douban',
				params: Isbn.split(':')[1]
			});
		},
		deleteHistory(index) {
			this.searchBookHistory.splice(index, 1);
			uni.setStorageSync(
				'searchBookHistory',
				JSON.stringify(this.searchBookHistory)
			);
		},
		deleteAllHistory() {
			this.searchBookHistory = [];
			uni.setStorageSync('searchBookHistory', JSON.stringify([]));
		},
		focus() {
			if (this.searchBookHistory.length > 0 && this.value == '')
				this.showHistory = true;
		},
		blur() {},
		clickKey(item) {
			this.value = item;
		},
		async addList() {
			if (this.pageIndex < this.MaxPages && !this.loading) {
				this.loading = true;
				uni.showLoading({
					title: '加载中'
				});
				try {
					const {
						data: { find_ifa_FindFullPage_list1: bookList }
					} = await this.$http.get(
						findBookPramer(this.value, ++this.pageIndex)
					);
					this.bookData.bookList.push(...bookList);
				} catch (e) {}
				uni.hideLoading();
				this.loading = false;
			}
		},
		throttleSearch: throttle(
			async function() {
				try {
					if (this.bookData.bookList.length > 0) {
						uni.showLoading({
							title: '加载中'
						});
					}
					const {
						data: {
							FindCount,
							find_ifa_FindFullPage_list1: bookList
						}
					} = await this.$http.get(
						findBookPramer(this.value, this.pageIndex)
					);
					uni.hideLoading();
					this.pageIndex = 1;
					this.bookData.bookList = bookList || [];
					this.bookData.FindCount = FindCount;
					if (
						this.value != '' &&
						this.searchBookHistory.indexOf(this.value) < 0 &&
						this.bookData.bookList.length > 0
					) {
						this.searchBookHistory.unshift(this.value);
						uni.setStorage({
							key: 'searchBookHistory',
							data: JSON.stringify(this.searchBookHistory)
						});
					}
				} catch (e) {
					console.log(e);
					this.bookData.bookList = [];
				}
				this.loading = false;
			},
			{ interval: 1000 }
		)
	},
	watch: {
		value() {
			if (this.value.trim() == '') {
				this.showHistory = true;
				return (this.bookData.bookList = []);
			} else {
				this.showHistory = false;
				this.loading = true;
				this.throttleSearch();
			}
		}
	}
};
</script>

<style scoped>
.item_tip {
	/* font-size: 16px;
    color: #616161;
    text-decoration: none;
    margin: 0.6rem 0.6rem 0 0;
    border-radius: 0.3rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem; */
	border: 1px solid rgba(0, 0, 0, 0.1);
}
table {
	width: 100%;
	border-collapse: collapse;
}
th,
td {
	padding: 3px;
	background-color: e9e9e9;
	border: 1px solid #aaa;
}
.coll {
}
</style>
