<template>
	<view class="bg-white minh-100">
		<cu-custom isBack>
			<template v-slot:content>
				新闻详情
			</template>
		</cu-custom>
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
		<tip ref="tip" />
	</view>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue';
import { replaceSpace } from './util.js';
let task = null;
export default {
	components: {
		uParse
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
			article: replaceSpace(`<div class="articleBody" id="articleBody" style=" margin-top:30px; margin-left:25px; margin-right:25px; margin-bottom:30px;">
               
               <center><span style="font-size:38px; font-weight:bold; line-height:40px;">关于征求《广东省重点领域研发计划“重点科技产业质量基础共性技术研究及应用”重点专项申报指南》意见的函</span></center>
               <br>
                单 位：科技与人文研究院
               <br>
               <p><span style="font-size:16px;">各有关单位：<br>
　　为全面贯彻落实党的十九大和习近平总书记关于加强关键核心技术攻关的重要讲话精神，落实《中共广东省委广东省人民政府关于实施质量强省战略的决定》、《广东省重点领域研发计划实施方案》总体要求，集中解决重点科技产业发展中检测、计量和认证等关键技术，广东省科技厅经前期调研、专家论证，结合省内重大技术和产业需求，形成了2020年度“重点科技产业质量基础共性技术研究及应用”重点专项申报指南征求意见稿（附件1）。</span><br>
<span style="font-size: 16px;">　　为提高项目组织的公平性、科学性和精准性，省科技厅现将申报指南（征求意见稿）向社会公开征求意见。</span><br>
<span style="font-size: 16px;">&nbsp; &nbsp; &nbsp; &nbsp;</span><span style="font-size: 16px;">有关修改意见和建议<span style="color:#ff0000;">将以单位名义整体通过系统提交</span>，</span><span style="font-size: 16px;">&nbsp;请有意见的老师填写申报指南意见反馈表，</span><span style="font-size: 16px;">于<span style="color:#ff0000;">2020年3月10日16时前发送至438184494@qq.com</span>，学校将统一提交至广东省科技厅。</span></p><p><span style="font-size: 16px;">&nbsp; &nbsp; &nbsp; 学校联系人：穆老师，15902060363<br>
&nbsp; </span>&nbsp; &nbsp; &nbsp;&nbsp;<span style="font-size: 16px;">省科技厅</span><span style="font-size: 16px;">联系人：江翌昕，020-83163635</span></p><p><span style="font-size:16px;">　<br>
　　附件：1.<a href="http://gdstc.gd.gov.cn/hdjlpt/yjzj/api/attachments/view/53cded05db49538620dc2464da2a26e4" target="_blank">2020年度广东省重点领域研发计划“重点科技产业质量基础共性技术研究及应用”重点专项申报指南征求意见稿</a></span></p><p><span style="font-size:16px;">　　　　　2.<a href="http://gdstc.gd.gov.cn/hdjlpt/yjzj/api/attachments/view/8cc168fb2e21b4175649cb402de57e2e" target="_blank">申报指南意见反馈表</a></span></p>
                   <br>
               </div>`)
		};
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
			this.url = isHttps ? url : url.replace('http', 'https');
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
	}
};
</script>

<style></style>
