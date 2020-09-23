<template>
	<view class="bg-white minh-100">
		<cu-custom isBack>
			<template v-slot:content>
				新闻详情
			</template>
		</cu-custom>
        <empty-tip v-if="article === ''" loading></empty-tip>
		<view class="py-3"><uParse @navigate="downloadFile" :content="article" /></view>
		<modal ref="modal" :round="true" :maskForce="isProgress">
			<block v-if="isProgress">
				<view class="cu-dialog  animation-fade bg-white animation-2" @tap.stop="" style="width:650rpx;">
					<view class="cu-bar "><view class="text-black text-center title w-1">直接打开文件</view></view>
					<view class="text-gray text-sm w-1 text-center">正在获取文件中,请稍候...</view>
					<view class="hg px-4 flex-column j-center">
						<view class="w-1" style="height: 8px;background-color: #F6F7F9;border-radius: 4px;">
							<view class="h-1 w-1 transition-1" style="transform-origin: left;border-radius: 4px;" :style="$themeBackground + loadingStr" />
						</view>
					</view>
					<view class="text-gray text-sm w-1 text-right px-4">{{ bytesStr }}</view>
					<view @tap="cancel" class="hg text-df text-center" :style="$themeFont">取消</view>
				</view>
			</block>
			<block v-else>
				<view class="cu-dialog " @tap.stop="" style="width:650rpx;">
					<view @tap="openFile" class="hg flex-row text-df px-4 border-bottom">打开文件</view>
					<view @tap="copyUrl" class="hg flex-row text-df  px-4">下载文件</view>
				</view>
			</block>
		</modal>
		<!-- <empty-tip loading/> -->
        <back-button v-show="isShare" />
		<tip ref="tip" />
	</view>
</template>

<script>
import { APIs } from '@/staticData/staticData.js';
import uParse from '@/components/gaoyia-parse/parse.vue';
import { replaceSpace } from '@/pages/news/util.js';
import backButton from '@/pages/file/file_backButton.vue';
let task = null;
export default {
	components: {
		uParse,
        backButton
	},
	data() {
		return {
			isProgress: false,
			progress: {
				progress: 0,
				totalBytesWritten: 0,
				totalBytesExpectedToWrite: 0
			},
			url: '',
			article: '',
			newsId:0,
            title:'',
            isShare:true,
		};
	},
	onLoad(e) {
		const id = decodeURIComponent(e.id);
        const title = decodeURIComponent(e.title)
        const isShare = decodeURIComponent(e.isShare)
        this.newsId = id
        this.title = title
        if (isShare == 1) {
            this.isShare = false;
        }
	},
	async mounted(){
		let article = '';
        let i=0
        while(i++<3){
            try {
            	const {
            		data: { error, data }
            	} = await this.$http.get(APIs.getNewsDetail + "/" + this.newsId);
            	article = data;
                if (+error == 1) {
                    break;
                }
            }catch(e){
            	console.log(e)
            };
        }
        console.log(article)
		this.article = replaceSpace(article)
	},
	computed: {
		bytesStr() {
			const written = (this.progress.totalBytesWritten / (1000 * 1000)).toFixed(1);
			const total = (this.progress.totalBytesExpectedToWrite / (1000 * 1000)).toFixed(1);
			return `${written}/${total}MB`;
		},
		loadingStr() {
			const progress = this.progress.progress || 0;
			return `transform: scaleX(${progress / 100});`;
		}
	},
	methods: {
		downloadFile(url) {
			//是否可直接预览 是则弹出选择框
			const isHttps = url.includes('news.gdut.edu.cn') && url.includes('https');
			this.url = isHttps ? url : url.toString().replace('http', 'https');
			const isDocType = ['ppt','doc','xsl','pdf'].some(item => url.includes(item));
			if( this.url.includes('news.gdut.edu.cn')&&isDocType){
				this.isProgress = false;
				this.$refs.modal.showModal();
			}else{
				this.copyUrl();
			}
		},
		cancel() {
			task.abort();
		},
		async openFile() {
			this.$refs.modal.showModal();
			this.isProgress = true;
			task = uni.downloadFile({
				url: this.url,
				success: res => {
					this.hideModal('获取文件完成'), console.log('ok');
					uni.openDocument({
						filePath: res.tempFilePath,
						success: () => {
							setTimeout(() => (this.progress.progress = 0), 700);
						}
					});
				},
				fail: res => {
					console.log(res);
					const { errMsg } = res;
					setTimeout(() => this.hideModal(errMsg.indexOf('abort') > -1 ? '已取消获取文件' : '获取文件失败,请检查网络'), 700);
				}
			});
			task.onProgressUpdate(progress => {
				this.progress = progress;
			});
		},
		hideModal(tip) {
			setTimeout(() => (this.isProgress = false), 800);
			this.$refs.modal.hideModal();
			if (tip) this.$refs.tip.show(tip);
		},
		copyUrl() {
			this.hideModal();
			uni.showModal({
				title: '提示',
				content: '因小程序储存限制,请在浏览器中粘贴链接下载',
				confirmColor: this.$commonFun.hexify(this.$colorList.theme),
				confirmText: '复制链接',
				success: e =>
					e.confirm &&
					uni.setClipboardData({
						data: this.url
					})
			});
		}
	},
    
    
    onShareAppMessage(res) {
        // 来自页面内转发按钮
        let _this = this;
        return {
            title: 'gdutday-校内新闻 | '+ _this.title,
            path:  '/pages/news/news-detail?id='+_this.newsId+'&title='+_this.title
        };
    },
    onShareTimeline(){
        let _this = this;
        return {
            title: 'gdutday-校内新闻 | '+ _this.title,
            query: 'id='+_this.newsId+'&title='+_this.title,
        };
    },
};
</script>

<style></style>
