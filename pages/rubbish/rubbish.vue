<template>
	<view class="bg-white" style="min-height: 100vh;">
		<custom-input v-model="value" placeholder="输关键字,网上搜"><template v-slot:content>垃圾分类查询</template></custom-input>
		<block v-if="value != ''">
			<block v-if="rubbishData.length == 0"><empty-tip :loading="loading" tip="什么都没搜到" /></block>
			<block v-else>
				<block v-for="(item, index) in rubbishData" :key="item.name">
					<view
					@tap="tap(item)"
						class="ripple flex-row w-1 py-2 pr-5 a-center j-sb animation-fade animation-3"
						:style="'animation-delay:' + Math.log10(index + 1) * 150 + 'ms'"
						style="height: 80px;"
					>
						<view class="flex-row a-center h-1 ">
							<view class="text-center hg" style="color: #C3C3C3;width: 50px;">{{ index + 1 }}</view>
							<view class="flex-column h-1 j-around flex-1 overflow-hidden">
								<view class="flex-row w-1 j-sb">
									<text class="text-df">{{ item.name }}</text>
									<text class="text-right text-df" :style="'color:' + colors[item.type].color">{{ colors[item.type].type }}</text>
								</view>
								<view class="wrap-2" style="color: #C3C3C3;">{{ item.tip }}</view>
							</view>
						</view>
					</view>
				</block>
			</block>
		</block>
		<view v-else class="pb-5">
			<block v-for="item in classify" :key="item.color">
				<view v-if="item.items.length > 1" class="qiun-bg-white qiun-title-bar qiun-common-mt">
					<view class="qiun-title-dot-light" :style="'border-left-color:' + item.color">{{ item.type }}</view>
				</view>
				<block v-for="nextItem in item.items" :key="nextItem.title">
					<view class="mt-5 rounded-2 depth-3 mx-2 pb-4 pt px-4 animation-slide-bottom" :style="'background-color:' + item.color">
						<view class="text-lg text-white text-center hg">{{ nextItem.title }}</view>
						<view v-for="(item3, index3) in nextItem.description" :key="index3" class="text-white text-indent line-5">{{ item3 }}</view>
					</view>
				</block>
			</block>
		</view>
		<modal ref="modal" :round="true">
			<view class="bg-white flex-column p-5" style="width: 650rpx;">
				<text class="">
					<text class="hg text-lg">
					{{ thing.name }}  
					</text>
					<text class="mx-2">
					属于  
					</text>
					<text class="hg text-lg" :style="'color:' + colors[thing.type].color">{{ colors[thing.type].type }}</text>
				</text>
				<text class="text-gray ">{{thing.explain}}</text>
				<text class="text-gray ">{{thing.contain}}</text>
				<text class="text-gray ">{{thing.tip}}</text>
			</view>
		</modal>
	</view>
</template>

<script>
import customInput from '@/components/custom-input.vue';
import commonFun from '@/commonFun.js';
import { classify } from '@/pages/rubbish/data.js';
const API = 'https://api.tianapi.com/txapi/lajifenlei/index',
	key = 'dc5a49fc428e36cfbba49d5cfdb1e5c7';
export default {
	components: {
		customInput
	},
	data() {
		return {
			value: '',
			rubbishData: [],
			loading: true,
			colors: [
				{ type: '可回收物', color: '#0458A0' },
				{ type: '有害垃圾', color: '#CF1A23' },
				{ type: '厨余垃圾', color: '#009230' },
				{ type: '其他垃圾', color: '#474546' }
			],
			thing: {
				contain:"常见包括菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头等",
				explain:"厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾。",
				name:"红苹果",
				tip:"纯流质的食物垃圾、如牛奶等，应直接倒进下水口。有包装物的湿垃圾应将包装物去除后分类投放、包装物请投放到对应的可回收物或干垃圾容器",
				type:2
			},
			classify: classify,
			throttle: null
		};
	},
	onLoad() {
		// #ifdef MP
		uni.showShareMenu();
		// #endif
	},
	computed: {
	},
	methods: {
		tap(item){
			this.thing = item ;
			this.$refs.modal.showModal();
		},
		throttleSearch: commonFun.throttle(
			async function() {
				try {
					const res = await this.$http.get(API, { params: { key: key, word: this.value } });
					if (res.data.code == 200)
						({
							data: { newslist: this.rubbishData }
						} = res);
				} catch (e) {
					this.rubbishData = [];
				}
				this.loading = false;
			},
			{ interval: 350 }
		)
	},
	watch: {
		value() {
			if (this.value.trim() == '') return (this.rubbishData = []);
			else {
				this.loading = true;
				this.throttleSearch();
			}
		}
	}
};
</script>

<style></style>
