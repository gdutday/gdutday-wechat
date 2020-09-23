<template>
	<view class="bg-white" style="min-height: 100vh;">
		<cu-custom isBack>
			<template v-slot:content>
				校内新闻
			</template>
		</cu-custom>
		<view class="list-container">
			<view class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
				<view class="item px-3 depth-3 active-shadow" v-for="(item,index) of list.list" :key="index">
					<view @tap="getNewsDetail(item.newsId,item.newsTitle)">
						<view :id="item.newsId" class="news-title ">{{item.newsTitle}}</view>
						<view class="news-owner ">{{item.newsOwner}}</view>
                        <view class="news-time">{{item.newsTime}}</view>
						<!-- <view class="news-type ">{{item.newsType}}</view> -->
					</view>
				</view>
			</view>
		</view>
		<view v-show="isLoadMore">
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
import { APIs } from '@/staticData/staticData.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
import {getTimeToCnameTime} from '@/commonFun.js';
export default {
	components:{
		uniLoadMore
	},
	data() {
		return {
			isLoadMore:true,
			loadStatus:'more',
			flagList:0,
			pageNum:1,
			viewList:[{list:[]},{list:[]}],
		}
	},
	async mounted() {
		this.getNewsList();
	},
	methods: {
		getNewsDetail(id,title) {
			uni.navigateTo({
			    url: '/pages/news/news-detail?id='+id+'&title='+title+'&isShare=1'
			}); 
		},
		async getNewsList() {
			try {
				const {
					data: { error, data }
				} = await this.$commonFun.rePromise({
					PromiseFunction: this.$http.get.bind(this.$http),
					parms: [
						APIs.getNewsList+"?pageNum=" + this.pageNum + "&pageSize=20"
					]
				});
				if (+error == 1) {
					this.pageNum++;
                    // console.log(data);
                    data.forEach(d=>{
                       d.newsTime = d.newsTime.replace(new RegExp("/","gm"),"-");
                       d.newsTime = getTimeToCnameTime(d.newsTime);
                    });
					this.putInfoToList(data);
					uni.stopPullDownRefresh();
				}
			} catch (e) {
				console.log(e);
			}
		},
		putInfoToList(dataList) {
			let _this = this;
			dataList.forEach(item => {
				let listFlag = _this.flagList % 2;
				_this.flagList++;
				this.viewList[listFlag].list.push(item)
			})
		},
	},
	onPullDownRefresh() {
		this.pageNum = 1;
		this.flagList = 0;
		this.viewList = [{list:[]},{list:[]}];
		this.getNewsList();
		console.log("refresh")
	},
	onReachBottom(){
		this.getNewsList();
		console.log("加载更多")
	},
}
</script>

<style lang="stylus" scoped>
    .list-container
        display flex
        justify-content space-between
        align-items:flex-start
        padding 0 24rpx
        padding-top 30rpx
        .list
            width calc(50% - 8rpx)
            display flex
            flex-direction column
            .item
                margin-bottom 20rpx
                border-radius: 25px
                background-color #A5D7FB
                .news-title
                    margin-top 18rpx
                    font-size 40rpx;
                    font-weight:bold;
                .news-owner
                    font-size 20rpx
                .news-type
                    font-size 20rpx
                .news-time
                    font-size 20rpx
                    margin-bottom 18rpx
</style>
<style scoped lang="scss"></style>