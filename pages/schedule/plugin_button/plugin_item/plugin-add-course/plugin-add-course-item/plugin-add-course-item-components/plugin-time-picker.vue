<template>
	<time-picker @cancel="close" @outputTime="getTime" :hours="time.hours" :mins="time.mins" />
</template>
<script>
import timePicker from '@/components/xing-time-picker.vue';
export default {
	components: {
		timePicker
	},
	inject: ['Bus'],
	data() {
		return {
			time: {
				hours: 8,
				mins: 30
			}
		};
	},
	computed: {},
	methods: {
		getTime(e) {
			this.time.hours = e.hours;
			this.time.mins = e.mins;
			this.Bus.$emit('timePick', e);
			this.close();
		},
		close(){
			this.Bus.hideModal('modal');
		}
	}
	//		watch:{
	//		},
};
</script>
<style scoped lang="scss"></style>
