<template>
	<view :style="$themeBackground" class="transition-5">
		<cu-custom :shadow="false" :fixed="false" bgColor="  ">
			<template v-slot:backText>
				<view class="flex-row a-end">
					<text class="text-df">{{ weather.month + '月' + weather.day + '日' }}</text>
					<text v-if="weather.weather" class="ml">{{ weather.degree + '℃ ' + weather.weather }}</text>
				</view>
			</template>
		</cu-custom>
		<!-- 因为切换背景的原因所以放在这里 -->
		<select-week />
	</view>
</template>
<script>
import selectWeek from '@/pages/schedule/schedule_content/schedule_components/select-week.vue';
export default {
	components: {
		selectWeek
	},
	data() {
		return {
			weather: {
				weather: '',
				degree: '',
				month: '',
				day: ''
			}
		};
	},
	created() {
		const time = new Date();
		this.weather.month = time.getMonth() + 1;
		this.weather.day = time.getDate();
		this.getWeather();
	},
	methods: {
		async getWeather() {
			const url = 'https://wis.qq.com/weather/common?source=xw&weather_type=forecast_1h|forecast_24h|index|alarm|limit|tips';
			const region = {
				province: '广东',
				city: '广州'
			};
			try {
				const {
					data: {
						data: { forecast_1h }
					}
				} = await this.$commonFun.becomePromise(uni.request, {
					url: url,
					data: region,
					header: {
						'content-type': 'application/json'
					}
				});
				const weather = forecast_1h[0];
				this.weather.weather = weather.weather;
				this.weather.degree = weather.degree;
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>
