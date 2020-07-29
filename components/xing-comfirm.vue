<template>
<view class="cu-dialog depth-5" @tap.stop="" style="width: 600rpx;">
    <view class="cu-bar bg-white">
        <view class="text-black text-center title w-1">{{ title }}</view>
    </view>
    <view class="flex-column p-2 border-bottom">
        <view class="py"></view>
        <view class="text-grey" style="line-height: 50rpx;text-align: left;">
            <slot></slot>
        </view>
    </view>
    <view class="hg flex-row ">
        <view @tap="fail" class="text-center  flex-1">{{ cancelText }}</view>
        <view @tap="success" :style="$themeBackground" class="text-white text-center flex-1">{{confirmText}}</view>
    </view>
</view>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        }
    },
    methods: {
        success() {
            this.$emit('success');
        },
        fail() {
            this.$emit('fail');
        },

    },
    data() {
        return {

        };
    }
}
</script>

<style scoped>
.select {
    text-align: left;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
}

.title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
}
</style>
