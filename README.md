# gdutday-uniapp 
前人栽树  后人乘凉  拥抱开源

## 写在前面
这里的内容和项目的结构没什么关系,主要说下之后 gdutday 维护问题.目前 gdutday 由广东工业大学电子科技协会(后文简称电协)负责后期运营,具体小程序运营和最高权限管理由电协网络组 [@elcbng](https://github.com/elcbng)完成.gdutday-wechat 承诺一年内至少不会做盈利相关的东西,免费的优质推广可以会考虑(如公益服务、学生心理健康教育推广).

## 项目架构与成员
本项目前端部分使用基于 [vue.js](https://github.com/vuejs/vue) 跨平台框架 [uniapp](https://github.com/dcloudio/uni-app) 开发 wechat 的小程序服务.目前提供课表查询、校内绩点、入馆二维码、校园导览等服务.项目架构大体满足 uniapp 的项目架构,除去部分不由 node 管理的一些JavaScript SDK 放置在了 js_sdk 目录,以及项目开始书写是在我们大一时期,大家的代码能力以及编程能力不足,造成了许多代码冗余和部分历史遗留问题,这部分欢迎大家重构.由于在地图导览中引入了腾讯地图sdk使得其在其他平台上的体验无法那么优质,以及国内绝大多数用户都习惯使用微信小程序,所以兼容微信平台.

最后感谢本 repo 的初创者
- [@Cerbur](https://github.com/Cerbur)
- [@xingxinglieo](https://github.com/xingxinglieo)

还没写完
