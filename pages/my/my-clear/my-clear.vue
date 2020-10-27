<template>
	<view>
		<cu-custom :isBack="true"><block slot="content">账号和缓存</block></cu-custom>
		<block v-for="(item, index) in list" :key="index">
			<ripple>
				<view class="hg flex-row j-sb a-center px-5 bg-white">
					<view>{{ item.item }}</view>
					<view @tap="change" class="ripple white capsul-button  text-white depth-2" :style="$themeBackground" :data-name="item.item">{{ item.operation }}</view>
				</view>
			</ripple>
		</block>
		<modal ref="modal">
			<comfirm @success="success" @fail="fail" :title="title">{{ 'Tip : ' + tip }}</comfirm>
		</modal>
		<tip ref="tip"></tip>
	</view>
</template>
<script>
import { defaultCourseBlock } from '@/staticData/staticData.js';
import { getClassAndExam } from '@/commonFun.js'
export default {
	components: {},
	data() {
		return {
			list: [
				{
					item: '刷新课程表',
					operation: '刷新'
				},
				{
					item: '统一认证账户更换/登录',
					operation: '更换'
				},
                {
                	item: '教务系统登录',
                	operation: '登录'
                },
				{
					item: '清除账号缓存',
					operation: '清除'
				},
				{
					item: '清除课表缓存/解决首页白屏问题',
					operation: '清除'
				},
				{
					item: '清除全部缓存',
					operation: '清除'
				}
			],
			title: '',
			tip: ''
		};
	},
	computed: {
		color() {
			return this.$store.getters.color;
		}
	},
	methods: {
		change(e) {
			let mes = e.currentTarget.dataset.name;
			switch (mes) {
				case '刷新课程表':
					getClassAndExam().then(res=>{
						if(res) {
							this.$Router.replaceAll({ name: 'schedule' });
						}
					})
					break;
				case '清除账号缓存':
					this.title = mes;
					this.tip = '清除账号(统一认证账号)后, 将不会刷新课表, 但课表数据保留, 详情请见隐私政策';
					this.$refs.modal.showModal();
					break;
				case '清除全部缓存':
					this.title = mes;
					this.tip = '清除全部缓存后, 将会清除课表数据,成绩,账号(统一认证账号)数据等数据, 请谨慎! 详情请见隐私政策';
					this.$refs.modal.showModal();
					break;
				case '清除课表缓存/解决首页白屏问题':
					this.title = mes;
					this.tip = '这将清除课表缓存并重新获取课表!';
					this.$refs.modal.showModal();
					break;
				case '统一认证账户更换/登录':
					this.$Router.push({ name: 'login' });
					break;
                case '教务系统登录':
                    this.$Router.push({ name: 'login-edu' });
                    break;
			}
		},
		fail() {
			this.$refs.modal.hideModal();
		},
		success() {
			if (this.title == '清除账号缓存') {
				this.$store.commit({
					type: 'changeStateofGlobal',
					stateName: 'account',
					value: { ID: '', password: '' },
					toStorage: true,
					toStringify: true
				});
				this.$refs.tip.show('清除成功, 如需重新登陆可点击 "更换统一认证账户"');
				this.$refs.modal.hideModal();
			} else if (this.title == '清除课表缓存/解决首页白屏问题') {
				this.$refs.modal.hideModal();
				this.$store.commit({
					type: 'changeStateofSchedule',
					stateName: 'classData',
					value: defaultCourseBlock,
					toStorage: true,
					toStringify: true
				});
				this.$store.commit({
					type: 'changeStateofSchedule',
					stateName: 'examData',
					value: [],
					toStorage: true,
					toStringify: true
				});
				getClassAndExam().then(res=>{
					if(res) {
						this.$Router.replaceAll({ name: 'schedule' });
					}
				})
			} else if (this.title == '清除全部缓存') {
				uni.clearStorageSync();
				this.$refs.tip.show('清除成功, 重新加载后生效');
				this.$refs.modal.hideModal();
				// this.$store.commit({
				// 	type: 'changeStateofGlobal',
				// 	stateName: 'account',
				// 	value: { ID: '', password: '' },
				// 	toStorage: true,
				// 	toStringify: true
				// });
				// this.$store.commit({
				// 	type: 'changeStateofSchedule',
				// 	stateName: 'classData',
				// 	value: defaultCourseBlock,
				// 	toStorage: true,
				// 	toStringify: true
				// });
				// this.$store.commit({
				// 	type: 'changeStateofSchedule',
				// 	stateName: 'examData',
				// 	value: [],
				// 	toStorage: true,
				// 	toStringify: true
				// });
				// this.$store.commit({
				// 	type: 'changeStateofSchedule',
				// 	stateName: 'addClassData',
				// 	value: [],
				// 	toStorage: true,
				// 	toStringify: true
				// });
				// this.$store.commit({
				// 	type: 'changeStateofSchedule',
				// 	stateName: 'campus',
				// 	value: '大学城校区',
				// 	toStorage: true
				// });
				// uni.removeStorageSync('countTimes');
				// this.$refs.tip.show('清除成功');
				// this.$refs.modal.hideModal();
				// this.$Router.replaceAll({ name: 'schedule' });
			}
		}
	}
};
</script>

<style scoped lang="scss"></style>
