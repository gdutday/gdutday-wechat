<template>
	<view id="course" style="width: 650rpx;">
		<view class="flex-row j-sb">
			<input
				style="width:500rpx;"
				class="text-df"
				type="text"
				placeholder="课程名称(必填)"
				v-model="name"
			/>
			<view class="flex-row flex-1 j-sb" v-if="addTag">
				<view class="text-df transition-2" @tap="deleteAdd" :style="$themeFont">
					删除
				</view>
				<view
					class="text-df transition-2"
					@tap="changeAdd"
					:style="hasAll ? $themeFont : 'color:#C8C8C8'"
				>
					修改
				</view>
			</view>
			<block v-else>
				<view
					class="text-df transition-2"
					@tap="add"
					:style="hasAll ? $themeFont : 'color:#C8C8C8'"
				>
					添加
				</view>
			</block>
		</view>
		<view class="hg flex-row a-center">
			<text class="cuIcon-tag mr-1"></text>
			<input
				class="d-inline-block text-sm flex-1"
				type="text"
				placeholder="上课地点(选填)"
				v-model="place"
			/>
		</view>
		<picker
			@change="firstTap"
			class="hg"
			@columnchange="changeStart"
			mode="multiSelector"
			:value="index"
			:range="range"
		>
			<view class="hg">
				<text class="cuIcon-time mr-1"></text>
				<block v-if="hasChoose">
					<text :style="$themeFont">{{ range[0][index[0]] }}</text>
					,第
					<text :style="$themeFont">{{ index[1] + 1 }}</text>
					节开始,
					<text :style="$themeFont">{{ index[2] + 1 }}</text>
					节课
				</block>
				<block v-else>选择课程时间</block>
			</view>
		</picker>
		<view class="hg flex-row j-sb">
			<view>
				<text class="cuIcon-calendar mr-1"></text>
				选择周数
				<text @tap="toAsk" class="cuIcon-question text-xs ml-1"></text>
			</view>
			<view class="flex-row a-center">
				<xing-radio
					:color="$colorList.theme"
					@check="checkAll"
					:checked="isAll"
				/>
				<text class="ml">全选</text>
			</view>
		</view>
		<view class="flex-row flex-wrap a-center" style="line-height: 40px;">
			<view
				class="check-group flex-row j-centerround round"
				style="padding: 15rpx 20rpx;"
				@tap="choose"
				:data-index="i"
				v-for="(item, i) in weekChoose"
				:key="i"
			>
				<view
					class="check-box round text-center flex-column j-center position-relative transition-5"
					:class="item.disabled ? 'disabled' : ''"
					:style="item.checked ? 'border-color:transparent' : ''"
				>
					<view
						v-if="!item.disabled"
						class="w-1 h-1 position-center round text-center flex-column j-center transition-3 overflow-hidden"
						:style="
							item.checked
								? 'transition:all .15s ease;' +
								  $themeBackground +
								  ';color:white;opacity:1;transform:translate(-50%,-50%) scale(1) '
								: 'transform:translate(-50%,-50%) scale(0);opacity:0'
						"
					>
						<text>{{ i + 1 }}</text>
					</view>
					<text v-if="item.disabled" class="cuIcon-close"></text>
					<text v-else>{{ i + 1 }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { textConflict } from '@/pages/schedule/schedule-common-fun.js';
import { diffCampusTime } from '@/staticData/staticData.js';
import { wait } from '@/commonFun.js';
let confirm;
export default {
	inject: ['Bus'],
	data() {
		return {
			name: '',
			place: '',
			index: [0, 0, 0],
			range: [],
			hasChoose: false,
			weekChoose: Array.from({ length: 20 }, () => ({
				checked: false,
				disabled: false
			})),
			addTag: 0,
			addIndex: 0
		};
	},
	created() {
		this.Bus.$on('addSchedule', async params => {
			this.addTag = 0;
			this.init();
			if (params !== undefined) {
				this.hasChoose = true;
				const { week, name, room: place, day, start, long } = params;
				this.name = name;
				this.place = place;
				this.hasChoose = true;
				this.index = [day, start, long];
				this.weekChoose.forEach(radio => (radio.checked = false));
				await this.$nextTick();
				week.forEach(index => (this.weekChoose[index].checked = true));
				this.ban();
			}
		});
		this.Bus.$on('changeSchedule', async addTag => {
			await this.changeSchedule(addTag, true);
			this.changeSchedule(addTag, false);
		});
		this.range = [
			['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
			Array.from(
				{ length: 12 },
				(item, index) =>
					`第${index + 1}节(${this.$store.getters.thisCampusTime[index].start})`
			),
			Array.from({ length: 12 }, (item, index) => index + 1 + '节课')
		];
	},
	computed: {
		//选择全部周的标志
		isAll() {
			return (
				this.weekChoose.every(item => item.checked || item.disabled) &&
				this.weekChoose.some(item => !item.disabled)
			);
		},
		during() {
			return diffCampusTime[this.$store.state.schedule.campus];
		},
		handleAddClassData() {
			//
			return this.$store.getters.handleAddClassData.map(item => {
				item = this.$commonFun.deepCopy(item);
				item.week = item.courseWeekAndContent.map(item => +item.courseWeek - 1);
				return item;
			});
		},
		_courseDay() {
			return this.handleAddClassData.map(item => item.courseDay - 1);
		},
		checkedWeek() {
			let weekChoose = [];
			this.weekChoose.forEach((item, index) => {
				if (item.checked && !item.disabled) weekChoose.push(index);
			});
			return weekChoose;
		},
		hasAll() {
			//参数拦截
			return this.hasChoose && this.name !== '' && this.checkedWeek.length !== 0;
		}
	},
	mounted() {
		// this.query();
	},
	methods: {
		async add() {
			const isCheck = await this.isCheck();
			if (this.hasAll && isCheck) {
				// productClassData()
				this.$store.commit({
					type: 'changeAddClassData',
					handle: addClassData => {
						addClassData.push({
							week: this.checkedWeek,
							name: this.name,
							room: this.place,
							day: this.index[0], //星期,0开始
							start: this.index[1], //开始课,0开始
							long: this.index[2], //课程长度 , 0开始
							addTag: +new Date()
						});
					}
				});
				this.Bus.$refs['tip'].show('添加课程成功');
				this.Bus.hideModal('bottomModal');
				setTimeout(() => (this.Bus.allModal.bottomModal.is = ''), 300);
			} else if (!isCheck) {
				this.Bus.$refs['tip'].show('添加课程失败,涉及敏感字符');
			}
		},
		deleteAdd() {
			this.$store.commit({
				type: 'changeAddClassData',
				handle: addClassData => {
					addClassData.splice(this.addIndex, 1);
				}
			});
			this.Bus.$refs['tip'].show('删除课程成功');
			this.Bus.hideModal('bottomModal');
		},
		async isCheck() {
			const {
				data: { error }
			} = await this.$http.post(this.$APIs.checkMsg, {
				content: this.name + this.place
			});
			return +error === 1;
		},
		async changeAdd() {
			const isCheck = await this.isCheck();
			if (this.hasAll && isCheck) {
				this.$store.commit({
					type: 'changeAddClassData',
					handle: addClassData => {
						addClassData.splice(this.addIndex, 1, {
							week: this.checkedWeek,
							name: this.name,
							room: this.place,
							day: this.index[0], //星期,0开始
							start: this.index[1], //开始课,0开始
							long: this.index[2], //课程长度 , 0开始
							addTag: +new Date()
						});
					}
				});
				this.Bus.$refs['tip'].show('修改课程成功');
				this.Bus.hideModal('bottomModal');
			} else if (!isCheck) {
				this.Bus.$refs['tip'].show('添加课程失败,涉及敏感字符');
			}
		},
		init() {
			this.name = '';
			this.place = '';
			this.hasChoose = false;
			this.index = [0, 0, 0];
			this.weekChoose.forEach(radio => (radio.checked = false));
		},
		async changeSchedule(addTag, first) {
			this.weekChoose.forEach(radio => (radio.checked = false));
			if (first) await wait(350);
			this.addTag = addTag;
			const addClassData = this.$store.state.schedule.addClassData;
			this.addIndex = addClassData.findIndex(add => add.addTag === addTag);
			this.ban();
			const { name, room: place, day, start, long, week } = addClassData[
				this.addIndex
			];
			this.name = name;
			this.place = place;
			this.hasChoose = true;
			this.index = [day, start, long];
			this.weekChoose.forEach(radio => (radio.checked = false));
			await this.$nextTick();
			week.forEach(index => (this.weekChoose[index].checked = true));
		},
		choose(e) {
			const index = e.currentTarget.dataset.index;
			if (!this.weekChoose[index].disabled) {
				this.weekChoose[index].checked = !this.weekChoose[index].checked;
			}
		},
		changeStart(e) {
			const longIndex = 2;
			const startIndex = 1;
			this.$set(this.index, e.detail.column, e.detail.value);
			if (e.detail.column == startIndex) {
				const length = 11 - e.detail.value;
				if (this.index[longIndex] > length)
					this.$set(this.index, longIndex, length);
				this.$set(
					this.range,
					longIndex,
					Array.from(
						{ length: length + 1 },
						(item, index) => index + 1 + '节课'
					)
				);
			}
			this.ban();
		},
		checkAll() {
			const _isAll = this.isAll;
			this.weekChoose = this.weekChoose.map(item => {
				if (!item.disabled) item.checked = !_isAll;
				return item;
			});
		},
		ban() {
			let isConflict = [];
			const parms = {
				start: this.during[this.index[1]].start,
				end: this.during[this.index[1] + this.index[2]].end,
				day: this.index[0]
			};
			const handlePrimeClassData = [...this.$store.getters.handlePrimeClassData];
			this.addTag ? handlePrimeClassData.splice(this.addIndex, 1) : '';
			const allClassData = [
				...this.$store.state.schedule.classData,
				...handlePrimeClassData,
				...this.$store.state.schedule.examData
			];
			textConflict({
				parms: parms,
				ClassAndExam: allClassData,
				during: this.during
			}).forEach(item => (isConflict = [...isConflict, ...item.week]));

			this.weekChoose.forEach((item, index) => {
				if (isConflict.indexOf(index) > -1) {
					this.weekChoose[index].checked = false;
					this.weekChoose[index].disabled = true;
				} else this.weekChoose[index].disabled = false;
			});
		},
		// query() {
		// this.$commonFun.reQueryDom('course', this).then(res => {
		// this.Bus.$emit('sendCourseHeight', 290);
		// }).catch((err)=>{});
		// },
		toAsk() {
			this.Bus.showModal({ key: 'ask' });
		},
		firstTap(e) {
			this.hasChoose = true;
		}
	}
};
</script>
<style scoped lang="scss">
.check-box {
	height: 50rpx;
	width: 50rpx;
	border: 1px solid #909399;
}

// .check-group.ripple {
// 	overflow: visible;
// }
.check-group.ripple:after {
	width: 100% !important;
	height: 100% !important;
	// top: -3px;
	// left: -3px;
}
.disabled {
	background: #909399 !important;
	border-color: #909399 !important;
	color: #f2f6fc !important;
}
</style>
