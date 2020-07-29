<template>
	<view class="bg-white flex-column p-5" style="width: 650rpx;">
		<text class="cuIcon-title hg ">为什么有些星期会被禁止选择呢 ? </text>
		<text class="text-gray ">添加前会检测是否与现有课表数据冲突 , 如果某个周冲突 , 将被禁止选择</text>
		<text class="cuIcon-title hg ">为什么之前添加的课表数据消失了呢 ? </text>
		<text class="text-gray ">课表刷新频率为每周第一次打开时刷新 , 如果您曾经添加的课程与教务系统课表数据或考试安排冲突了, 课表将优先显示教务系统的数据</text>
	</view>
</template>

<script>
	export default{
	}
</script>