<template>
<view style="height: 502rpx;">
    <view class="waveWrapper waveAnimation all-1 ">
        <view class="waveWrapperInner" style="z-index: 15;">
            <slot></slot>
        </view>
        <view class="waveWrapperInner bgTop">
            <view class="wave waveTop" style="background-image: url('https://7869-xingxinglieo-tecft-1300484036.tcb.qcloud.la/wave/wave_1.png?sign=70e393df83afa4d34caca9bd34c6d530&t=1575908771')"></view>
        </view>
        <view class="waveWrapperInner bgMiddle">
            <view class="wave waveMiddle" style="background-image: url('https://7869-xingxinglieo-tecft-1300484036.tcb.qcloud.la/wave/wave_2.png?sign=3cd6475c930dcc95f8393a2d461a559e&t=1575908811')"></view>
        </view>
        <view class="waveWrapperInner bgBottom" :style="color">
            <view class="wave waveBottom" style="background-image: url('https://7869-xingxinglieo-tecft-1300484036.tcb.qcloud.la/wave/wave_3.png?sign=4fed4542f84042cbcaaec6490d4823ad&t=1575908856')"></view>
        </view>
    </view>
</view>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        color() {
            return `background-image: linear-gradient(to bottom, ${this.$store.getters.color.white}, ${this.$store.getters.color.theme});`
        }
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
@keyframes move_wave {
    0% {
        transform: translateX(0) translateZ(0) scaleY(0.4)
    }

    50% {
        transform: translateX(-25%) translateZ(0) scaleY(0.2)
    }

    100% {
        transform: translateX(-50%) translateZ(0) scaleY(0.4)
    }
}

.waveWrapper {
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
}

.waveWrapperInner {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    bottom: -1rpx;
}

.bgTop {
    z-index: 8;
    opacity: 0.5;
}

.bgMiddle {
    z-index: 10;
    opacity: 0.75;
}

.bgBottom {
    z-index: 5;
}

.wave {
    position: absolute;
    left: 0;
    width: 200%;
    height: 100%;
    background-repeat: repeat no-repeat;
    background-position: 0 bottom;
    transform-origin: center bottom;
}

.waveTop {
    background-size: 50% 40rpx;
}

.waveAnimation .waveTop {
    animation: move-wave 1s;
    animation-delay: .8s;
}

.waveMiddle {
    background-size: 50% 120rpx;
}

.waveAnimation .waveMiddle {
    animation: move_wave 3s linear infinite;
}

.waveBottom {
    background-size: 50% 100rpx;
}

.waveAnimation .waveBottom {
    animation: move_wave 4s linear infinite;
}
</style>
