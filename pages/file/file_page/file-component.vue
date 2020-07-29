<template>
	<view class="bg-white" style="min-height: 100vh;">
		<custom-input v-model="value" placeholder="搜索本页">
			<block slot="content">{{name}}</block>
		</custom-input>
		<block v-if="level == 0 && recentIconLength">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">最近打开</view></view>
			<view class="w-1 px-5 flex-row box-content" :style="'height:80px;'">
				<block v-for="(item, index) in recentIcon" :key="index">
					<view style="width: 16.6%;" @tap="next(item, true)" class="flex-column j-around a-center">
						<view class="flex-column a-center j-center bg-white" style="width:40px;height:40px;border-radius:50%">
							<image :src="item.icon" style="height: 35px;width: 35px;" />
						</view>
						<text class="text-xxs text-center flex-1 overflow-hidden wrap-3" >
							{{ item.name }}
						</text>
					</view>
				</block>
			</view>
		</block>
		<view>
			<image
				v-if="!hasFileData && loadingShow"
				class="position-absolute all-1 gif-white response position-center"
				src="https://image.weilanwl.com/gif/rhomb-white.gif"
				mode="aspectFit"
			/>
			<block v-if="emptyShow">
				<empty-tip />
			</block>
			<block v-for="(item, index) in filterFileData" :key="item.name">
				<view
					@tap="next(item, false)"
					class="ripple flex-row w-1 a-center j-sb px-5 animation-fade animation-3"
					style="height: 80px;border-bottom:1px solid rgba(206,206,206,.15);"
					:style="'animation-delay:' + Math.log10(index + 1) * 150 + 'ms'"
				>
					<view class="flex-row a-center" style="height:45px">
						<image :src="iconType(item.type) == 'pic' ? item.url : icon[index]" class="h-1 mr-2" style="width:45px;" />
						<view class="flex-column h-1 j-sb flex-1 wrap-2">
							<text class="text-df" style="word-break:break-all;">{{ item.name }}</text>
							<text style="color: #C3C3C3;">2.3MB</text>
						</view>
					</view>
					<!-- <view style="height: 45px;" class="flex-column j-sb">
						<view class="text-right text-df" :style="'color:' + item.color">{{ item.type }}</view>
						<view class="text-sm" style="color: #C3C3C3;">{{ index }}</view>
					</view> -->
				</view>
			</block>
		</view>
		<tip ref="tip" />
		<back-button v-if="level > 0" />
	</view>
</template>

<script>
import { iconType } from '@/pages/file/file_commonFun.js';
import backButton from '@/pages/file/file_backButton.vue';
import customInput from '@/components/custom-input.vue';
import { APIs } from '@/staticData/staticData.js';
export default {
	components: {
		backButton,
		customInput
	},
	data() {
		return {
			level: 0,
			url: APIs.giteeDownloadRoot,
			pwd: '/',	//等于原来的url存储当前文件夹的路径
			name: '资料',
			value: '',
			fileData: [],
			loadingShow: true,
			emptyShow: false
		};
	},
	async created() {
		this.init();
		try {
			const {
				//接受gitee端返回的参数
				data: {tree},
				/**
				 * tree{
						path:文件or文件夹名
						type: 文件类型 tree为文件夹，blob为文件
						url: 下一个路径的请求地址(仅文件夹需要用到)
						size: 文件大小 仅文件有(byte)
					}
				 */
			} = await this.$http.get(this.url);
			this.loadingShow = false;
			// console.log(tree)
			if (tree != null) {
				tree.length
					? (this.fileData = tree.map(item => {
						var fileName = item.path;
						if (this.pwd == '/' 
							&& (fileName == "LICENSE" 
							|| fileName == "Hello.txt"
							|| fileName == "README.md"
							)){
							// return;
						}
						//给文件设定初始都是文件夹的情况
						var fileType = "folder";
						var fileUrl = item.url;
						//加入此返回值为文件，设定对应的
						if (item.type == "blob") {
							//提取文件后缀名作为文件类型
							fileType = item.path.substring(item.path.lastIndexOf('.') + 1);
							//根据文件名和所处的路径生成 对应的文件下载路径
							fileUrl = APIs.download + this.pwd + item.path;
						}
						return {
							type: fileType,
							name: fileName,
							url: fileUrl,
						};
					  }))
					: (this.emptyShow = true);
			} else throw new Error('');
		} catch (e) {
			console.log(e);
			this.loadingShow = false;
			this.emptyShow = true;
			this.showTip('获取文件列表失败,请检查网络');
			//TODO handle the exception
		}
	},
	beforeDestroy() {
		this.$store.commit('popStack');
	},
	computed: {
		//搜索关键词的过滤
		filterFileData() {
			if (this.value == '') return this.fileData;
			else return this.fileData.filter(item => item.name.indexOf(this.value) > -1);
		},
		imageData() {
			return this.filterFileData.filter(item => iconType(item.type) == 'pic').map(item => item.url);
		},
		icon() {
			return this.filterFileData.map(item => {
				return `/static/file/${iconType(item.type)}.png`;
			});
		},
		recentStack() {
			return this.$store.state.file.recentStack;
		},
		recentIcon() {
			return this.recentStack.map(item => {
				item = this.$commonFun.deepCopy(item);
				item.icon = `/static/file/${iconType(item.type)}.png`;
				return item;
			});
		},
		recentIconLength() {
			return this.recentIcon.length;
		},
		recentImage() {
			return this.recentStack.filter(item => iconType(item.type) == 'pic').map(item => item.url);
		},
		hasFileData() {
			return this.fileData.length > 0;
		}
		
	},
	methods: {
		init() {
			this.$store.commit('pushStack');
			const stack = this.$store.state.file.stack;
			this.level = stack.length - 1;
			this.url = stack[this.level].url;
			this.pwd = stack[this.level].pwd;
			this.name = stack[this.level].name;
		},
		iconType,
		next(item, fromRecent) {
			const { type, url, name } = item,
				nextLevel = this.level + 1;
			if (iconType(type) == 'pic') return this.openImage(item, fromRecent ? this.recentImage : this.imageData);
			if (type == 'folder') {
				this.$store.commit({
					type: 'changeStateofFile',
					stateName: 'templeItem',
					value: {
						url: url,
						pwd: this.pwd + name + '/',
						name: name
					}
				});
				this.$Router.push({
					name: 'file_' + nextLevel
				});
			} else {
				this.$Router.push({ name: 'file_detail', params: { ...item, unShare: true } });
			}
		},
		openImage({ type, url, name }, data = this.imageData) {
			this.$store.commit('unshiftRecentStack', { url: url, type: type, name: name, unShare: true });
			return uni.previewImage({
				urls: data,
				current: url
			});
		},
		showTip(content) {
			this.$refs.tip.show(content);
		}
	}
};
</script>

<style></style>
