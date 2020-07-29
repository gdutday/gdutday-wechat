<template>
<view class="cu-dialog depth-5" @tap.stop="" style="width: 600rpx;">
    <view class="cu-bar bg-white">
        <view class="text-black text-center title w-1">弹窗设置</view>
    </view>
    <view class="flex-column p-2">
        <picker class="hg" mode="selector" :value="index" :range="_range" @change="slide">
            <view class="row j-sb">
                <view>自动弹出时间</view>
                <view>
                    <text :style="$themeFont" class="text-df">{{ _time }}</text>
                    <text class="text-xs text-gray">分钟内</text>
                </view>
            </view>
        </picker>
        <view class="py"></view>
        <view class="text-xs text-grey" style="line-height: 50rpx;text-align: left;">
            Tip : 上课前加载小程序时直接弹出最近的课程信息框, 0 为关闭此功能 , Infinity 为每次加载都会弹框
        </view>
    </view>
    <view style="height: 2px;background:#EBEBEB;"></view>
    <view class="hg flex-row ">
        <view @tap="fail" class="text-center flex-1">取消</view>
        <view @tap="success" :style="$themeBackground" class="text-center text-white flex-1">确定</view>
    </view>
</view>
</template>

<script>
// import modal from '@/components/xing-modal.vue';
import {
    diffCampusTime
} from '@/staticData/staticData.js';
export default {
    components: {
        // modal
    },
    inject: ['Bus'],
    data() {
        return {
            range: Array.from({
                length: 8 + 1
            }, (item, index) => index * 5),
            index: this.$commonFun.getStorageSync('noticeTime', 0)
        };
    },
    computed: {
        _range() {
            return this.range.map((item, index) => {
                return item + '';
            });
        },
        _time() {
            return this.range[this.index] + '  ';
        }
    },
    created() {
        this.range.push(Infinity); //总长是42
    },
    methods: {
        slide(e) {
            this.index = e.detail.value;
        },
        success() {
            this.$isShake ? uni.vibrateShort() : '';
            this.Bus.hideModal('modal');
            uni.setStorage({
                key: 'noticeTime',
                data: this.index,
                success: () => {
                    this.Bus.$refs['tip'].show('设置成功,重新加载时生效');
                }
            });
        },
        fail() {
            this.Bus.hideModal('modal');
        }
    }
    //		watch:{
    //		},
};
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
}
</style>
