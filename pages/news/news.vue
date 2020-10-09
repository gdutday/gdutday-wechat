<template>
	<view class="body-background" style="min-height: 100vh;">
		<cu-custom isBack>
			<template v-slot:content>
				校内新闻
			</template>
		</cu-custom>
        <empty-tip v-if="isEmpty === true" loading></empty-tip>
		<view class="list-container">
			<view class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
				<view class="item px-3 drop-shadow active-shadow" v-for="(item,index) of list.list" :key="index">
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
			isLoadMore:false,
			loadStatus:'loading',
            isEmpty:true,
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
                    if (data.length == 0) {
                        this.loadStatus = 'noMore';
                        return;
                    }
					this.pageNum++;
                    // console.log(data);
                    data.forEach(d=>{
                       d.newsTime = d.newsTime.replace(new RegExp("/","gm"),"-");
                       d.newsTime = getTimeToCnameTime(d.newsTime);
                    });
					this.putInfoToList(data);
                    this.isEmpty = false
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
	},
	onReachBottom(){
        this.isLoadMore = true;
		this.getNewsList();
	},
}
</script>

<style lang="stylus" scoped>
    .list-container
        display flex
        justify-content space-between
        align-items:flex-start
        padding-left: 30rpx
        padding-right: 30rpx
        // padding 0 24rpx
        padding-top: 40rpx
        .list
            width calc(50% - 25rpx)
            display flex
            flex-direction column
            .item
                margin-bottom 40rpx
                // border-radius: 35px
                .news-title
                    margin-top 18rpx
                    font-size 35rpx;
                    font-weight:bold;
                .news-owner
                    font-size 20rpx
                .news-type
                    font-size 20rpx
                .news-time
                    font-size 20rpx
                    margin-bottom 18rpx
</style>
<style>
.body-background {
    background: #dde5e9;
}
.drop-shadow {
    border-radius: 33rpx;
    background: #dde5e9;
    box-shadow:  13rpx 13rpx 26rpx #acb3b6, 
                 -13rpx -13rpx 26rpx #ffffff;
}
</style>