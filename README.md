# `@joyshion/taro-plugin-platform-yunshanfu`

Taro云闪付小程序平台插件

## 安装
```bash
yarn add @joyshion/taro-plugin-platform-yunshanfu
```

### 配置
```js
// Taro 项目配置
module.exports = {
  // ...
  plugins: [
    '@joyshion/taro-plugin-platform-yunshanfu'
  ]
}
```

### 使用
#### UPSDK的引用
修改src/index.html，在head中加入云闪付前端SDK的引入标签
```html
<head>
  <title>myApp</title>
  <%= htmlWebpackPlugin.options.upsdk %>
  <script><%= htmlWebpackPlugin.options.script %></script>
</head>
```
#### 编译打包
```shell
taro build --type ysf
```
#### 开发调试
```shell
taro build --type ysf --watch
```

#### 其他
云闪付小程序平台类型：`ysh`
- Taro的API/组件同H5一致
- 支持内置环境变量，通过`process.env.TARO_ENV`判断编译平台类型
- 支持多端组件
- 支持多端脚本逻辑
- 支持多端页面路由
