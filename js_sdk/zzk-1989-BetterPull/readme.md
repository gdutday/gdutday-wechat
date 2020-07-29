#运行demo

common文件夹复制到uni项目根目录	
把demo.vue 放到 pages中，	
pages.json的pages中添加	

```json
{
   "path": "pages/demo",
   "style": {
      "navigationBarTitleText": "演示",
        "enablePullDownRefresh": true
      }
}
```

运行
访问这个页面

#用法

## 1 设置

开启页面的下拉刷新	
 在pages.json中需要开启下拉刷新的页面的style中添加"enablePullDownRefresh": true
```json
{
   "path": "pages/demo",
   "style": {
      "navigationBarTitleText": "演示",
        "enablePullDownRefresh": true
      }
}
```

## 2 集成：	
在vue页面中引入	
import BetterPull from "@/common/BetterPull";

在vue中添加mixins
mixins: [BetterPull({getPage(page,done){done(); }})],
参数说明：
page  int 页码，从1开始
done(Array)  function   结束函数，参数是ajax返回的数组

## 3 使用
<view v-for="db in list">{{db}}</view>
这里的list可以在mixins中定义，可以看demo.vue

刷新
this.Refresh();