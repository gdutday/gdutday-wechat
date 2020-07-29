export default function xingSwiperComponent({
	length,
	index = 0
} = {}) {
	if (length == undefined) throw new Error('swiperLength is required')
	return {
		data() {
			return {
				swiperList: [index, 0, 0],
				swiperCurrent: 0,
			};
		},
		created() {
			this.$_handleSwiperList();
		},
		methods: {
			$_handleSwiperList() {
				const nowIndex = this.swiperList[this.swiperCurrent];
				this.$set(this.swiperList, (this.swiperCurrent + 1) % 3, (nowIndex + 1) % length);
				this.$set(this.swiperList, (this.swiperCurrent + 2) % 3, (nowIndex + length - 1) % length);
				
			},
			refreshIndex(index) {
				this.swiperList[this.swiperCurrent] = index;
				this.$_handleSwiperList();
			}
		},
		watch: {
			swiperCurrent() {
				this.$_handleSwiperList();
			}
		}
	};
}
