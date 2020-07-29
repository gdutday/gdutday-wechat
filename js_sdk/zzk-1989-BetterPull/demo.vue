<style>
.test {
  height: 400upx;
}
</style>
<template>
  <view class="content">
    <view>
      <view class="test" v-for="db in list">aaa{{db}}</view>
      <!-- 这里的list是在BetterPull中设置的，默认可以省略参数，只要getPage -->
    </view>
  </view>
</template>
<script>
import BetterPull from "@/common/BetterPull";
export default {
  mixins: [
    BetterPull({
      getPage(page, done) {
        console.log(`获取第${page}页数据`);
        //ajax获取数据后使用done保存当前页面的数据
        setTimeout(() => {
          done([1, 2, 3, 4, 5]);
        }, 1000); //模拟ajax，可以看下面的注释

        // uni.request({
        //   url: base + url,
        //   method: "POST",
        //   data:{page},
        //   success: res => {
        //     var data = res.data;//获取当前页数组
        //     done(data.list)//调用done可以更新页面，同时结束下拉刷新，上拉加载
        //   },
        //   fail: err => {
        //     done([]);//如果没有数据也需要调用
        //   }
        // });
      },
      list: "list", //变量名不冲突可以省略
      page: "page" //变量名不冲突可以省略
    })
  ],
  data() {
    return {
      //如果data中用到list和page，可以在设置中自定义
    };
  },
  onLoad() {},
  methods: {}
};
</script>


