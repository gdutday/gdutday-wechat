<template>
	<view class="flex-column h-100 animation-fade">
		<custom />
		<schedule-content />
		<plugin-button />
		<back-button />
		<modal type="bottomModal" :once="true" ref="bottomModal">
			<plugin-add-course :class="bottomModalType == 'add' ? '' : 'display-none'" />
			<!-- <plugin-add-course v-if="bottomModalType == 'add'" /> -->
		</modal>
		<modal ref="modal" :once="true" :z="allModal.modal.z">
			<view :class="modalType == 'classDetail' ? '' : 'display-none'"><class-detail-modal /></view>
			<plugin-background v-if="modalType == 'background'" />
			<time-picker v-else-if="modalType == 'timePicker'" />
			<plugin-notice v-else-if="modalType == 'notice'" />
			<repeat v-else-if="modalType == 'repeat'" />
			<ask v-else-if="modalType == 'ask'" />
			<QR v-else-if="modalType == 'QR'" />
			<payWarning v-else-if="modalType == 'pay'" />
		</modal>
		<tip ref="tip" />
	</view>
</template>

<script>
import { APIs } from '@/staticData/staticData.js';
import { getStorageSync } from '@/commonFun.js';
import custom from '@/pages/schedule/custom/custom.vue';
import scheduleContent from '@/pages/schedule/schedule_content/schedule-content.vue';
import classDetailModal from '@/pages/schedule/schedule_content/schedule_components/schedule_week/week-class-detail-modal.vue';
import pluginButton from '@/pages/schedule/plugin_button/plugin-button.vue';
import backButton from '@/pages/schedule/back_button/back-button.vue';
import pluginBackground from '@/pages/schedule/plugin_button/plugin_item/plugin--skinfill-background.vue';
import pluginNotice from '@/pages/schedule/plugin_button/plugin_item/plugin-noticefill-notice.vue';
import pluginAddCourse from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course.vue';
import timePicker from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-item/plugin-add-course-item-components/plugin-time-picker.vue';
import repeat from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-item/plugin-add-course-item-components/plugin-repeat.vue';
import QR from '@/pages/schedule/schedule_content/schedule_components/extensions/libraryQR/QR.vue';
import payWarning from '@/pages/schedule/schedule_content/schedule_components/extensions/pay/pay-warning.vue';
import ask from '@/pages/schedule/plugin_button/plugin_item/plugin-add-course/plugin-add-course-class/plugin-add-course-class-components/plugin-add-course-class-ask.vue';
// import addItemButton from '@/pages/schedule/add-item-button.vue'
export default {
	components: {
		custom,
		scheduleContent,
		classDetailModal,
		pluginButton,
		backButton,
		pluginBackground,
		pluginNotice,
		pluginAddCourse,
		timePicker,
		repeat,
		QR,
		payWarning,
		ask
		// addCourse,
		// addItemButton,
	},
	// #ifdef MP
	created() {
		this.$on('changeShareParams', params => (this.shareParams = params));
	},
	onLoad(query) {
		uni.showShareMenu();
		this.update();
		if (query.params !== undefined) {
			this.showModal({
				type: 'bottomModal',
				key: 'add'
			});
			this.$emit('addSchedule', JSON.parse(query.params));
		}
	},
	onShareAppMessage(res) {
		// 来自页面内转发按钮
		const isButton = res.from === 'button';
		return {
			title: isButton ? 'gdutday-转发课程' : '颜值超高的课表小程序-gdutday分享给你',
			path: `/pages/schedule/schedule${isButton ? '?params=' + JSON.stringify(this.shareParams) : ''}`
		};
	},
	onShareTimeline(){},
	// #endif
	data() {
		return {
			shareParams: {},
			allModal: {
				modal: {
					is: 'classDetail',
					z: 9999
				},
				bottomModal: {
					is: '',
					z: 9999
				}
			}
		};
	},
	computed: {
		modalType() {
			return this.allModal.modal.is;
		},
		bottomModalType() {
			return this.allModal.bottomModal.is;
		}
	},
	provide() {
		return {
			Bus: this
		};
	},
	methods: {
		showModal({ key = '', type = 'modal' } = {}) {
			this.allModal[type].is = key;
			Object.keys(this.allModal).forEach((item, index) => {
				if (item != type && this.$refs[item].show) {
					this.allModal[type].z = this.allModal[item].z + 1;
				}
			});
			this.$nextTick(() => this.$refs[type].showModal());
		},
		hideModal(type = 'modal') {
			this.$refs[type].hideModal();
		},
		async update() {
			//版本更新提示
			// #ifdef MP-WEIXIN
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(async ({ hasUpdate }) => {
				if (!hasUpdate) {
					//没有新版本即已更新
					//版本更新内容提示
					const {
						data: { version }
					} = await this.$http.get(APIs.version);
					const beforeVersion = getStorageSync('version', '1.0.0');
					//如果版本号不匹配则说明未看过更新说明
					if (beforeVersion !== version && this.$account.ID !== '') {
                        let that = this;
						uni.showModal({
							title: '更新说明',
							content: '您已更新至最新版本，是否要查看更新说明 ? ',
							confirmColor: this.$commonFun.hexify(this.$colorList.theme),
							confirmText: '查看',
                            success (res) {
                                if(res.confirm) {
                                    that.$Router.push({ name: 'mark' })
                                }
                            }
							// success: e => this.$Router.push({ name: 'mark' })
						});
						uni.setStorageSync('version', version);
					}
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
schedule-content {
	flex: 1;
}
</style>
