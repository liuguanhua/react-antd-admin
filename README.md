# <h1 align="center">react-antd-admin</h1>

<p align="center">
  <a href="https://github.com/nodejs/node" target="_blank">
    <img alt="Node Version" src="https://img.shields.io/badge/node-12.14.0-brightgreen" />
  </a>
  <a href="https://github.com/facebook/react" target="_blank">
    <img alt="React Version" src="https://img.shields.io/badge/react-16.8.6-brightgreen" />
  </a>
   <a href="https://github.com/microsoft/TypeScript" target="_blank">
    <img alt="TypeScript Version" src="https://img.shields.io/badge/typescript-3.7.2-brightgreen" />
  </a>
 <a href="https://github.com/ant-design/ant-design" target="_blank">
    <img alt="Antd Version" src="https://img.shields.io/badge/antd-3.25.1-brightgreen" />
  </a>
  <a href="https://github.com/liuguanhua/react-antd-admin/releases" target="_blank">
     <img alt="React-Antd-Admin Version" src="https://img.shields.io/badge/releases-1.0.0-blue.svg?cacheSeconds=2592000" />
  </a>
</p>

## 📖 介绍

基于工作中开发需要，设计了一个后台前端管理系统，节省从零开始搭建的时间，前端基于[react](https://github.com/facebook/react)（拥抱 hooks）、[typescript](https://github.com/microsoft/TypeScript)、[antd](https://github.com/ant-design/ant-design)、[dva](https://github.com/dvajs/dva)及一些特别优秀的开源库实现，特别感谢。

使用[node](https://nodejs.org/zh-cn)、[mockjs](https://github.com/nuysoft/Mock)模拟了一层数据服务，部署在[now.sh](https://zeit.co)平台上。

## 🏠 主页

<!-- [预览地址一](https://liuguanhua.github.io/react-antd-admin/)（推荐） -->

[预览](https://react-antd-admin.lhh.now.sh/)

![demo](https://s2.ax1x.com/2020/01/14/lL9rJU.png)

![demo](https://s2.ax1x.com/2020/01/16/lvekAU.gif)

![二维码](https://s2.ax1x.com/2020/01/14/lLSd6s.png)

## 📁 目录

```
react-antd-admin
│
├── client                            * 前端目录
│   ├── config                        * 独立配置、发布时便于修改
│   ├── public                        * 静态资源文件，不被编译
│   ├── src
│   │   ├── assets                    * 资源文件(图标、图片、样式)
│   │   ├── components                * 公共组件
│   │   ├── scripts                   * 脚本(axios数据请求、常量、路由配置、工具函数)
│   │   ├── store                     * mock、redux数据流
│   │   ├── views                     * 视图展示页面
│   │   ├── index.tsx                 * 入口文件
│   │   └── serviceWorker.ts          * serviceWorker
│   ├── typings                       * 类型定义
│   ├── config-overrides.js           * 扩展webpack、create-react-app配置
│   ├── tsconfig.json                 * typescript配置
│  
└── server                            * 接口目录
    ├── public                        * 资源文件
    ├── routes                        * API路由
    ├── scripts                       * 脚本(常量、工具函数)
    ├── nodemon.json                  * nodemon配置
    ├── now.json                      * now配置
    └── app.js                        * API入口
```

## ✨ 特征

> - **页面**

    - 登录、注册
    - 首页数据统计展示
    - 信息中心（邮件功能的一部分效果）
    - 订单统计，地图展示各省市订单量
    - 会员管理（添加、删除、编辑、查询）

> - **组件**

    - 视频
    - 拖拽
    - 无限加载
    - PDF预览
    - 编辑器
        - 富文本
        - Markdown

> - **其它**

    - 骨架屏、响应式
    - 多皮肤
    - 弹窗拖拽
    - 图表
    - 页面鉴权（实际开发中建议动态读取菜单）
    - 按需加载路由
    - mock数据
    - 封装API请求及一些高阶组件、异常处理

## 💻 使用

```
下载：git clone https://github.com/liuguanhua/react-antd-admin.git

进入：cd react-antd-admin

client端
    进入：cd client
    安装：yarn install
    开发：yarn start
    访问：http://localhost:8888

    生产：yarn build

server端
    进入：cd server
    安装：yarn install
    开发：yarn start
    访问：http://localhost:9999
```

## 👤 作者

- 个人主页: [liuguanhua.github.io](https://liuguanhua.github.io)
- Github:[@liuguanhua](https://github.com/liguanhua)

## 🤝 支持

有什么好的想法、建议、问题和功能需求，欢迎 👋 提出。如果觉得这个项目不错或者对您有帮助，👏 赞一 个 ⭐️❤️！
