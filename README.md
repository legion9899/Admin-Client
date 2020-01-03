## 项目开发准备

1. 描述项目
2. 技术选型
3. API 接口 / 接口文档 / 测试接口

## 启动项目开发

1. 使用 React 脚手架创建项目
2. 开发环境运行：`npm start`
3. 生产环境打包运行：`npm run build`

## Git 管理项目

### 1. 创建远程仓库
### 2. 创建本地仓库

- 配置 `.gitignore`
- `git init`
- `git add`
- `git commit -m "init"`

### 3. 将本地仓库推送到远程仓库

- `git remote add origin url`
- `git push origin master`

### 4. 在本地创建 `dev` 分支，并推送到远程

- `git checkout -b dev`
- `git push origin dev`

### 5. 如果本地有修改

- `git add .`
- `git commit -m "xxx"`
- `git push origin dev`

### 6. 新的同事：克隆仓库

- `git clone url`
- `git checkout -b dev origin/dev`
- `git pull origin dev`

### 7. 如果远程修改了

- `git pull origin dev`

### 8. 如果得到后面新增的远程分支

- `git pull`
- `git checkout -b dev origin/xxx`

## 创建项目的基本结构

- `api`：ajax 请求的模块
- `components`：非路由组件
- `pages`：路由组件
- `App.js`：应用的根组件
- `index.js`：入口文件

## 引入 antd

- 下载 antd 的包
- 按需打包：只打包 `import` 引入组件的 `js` / `css`
  + 下载工具包
  + `config-overrides.js`
  + `package.json`
- 自定义主题
  + 下载工具包
  + `config-overrides.js`
- 使用 antd 的组件
  + 根据 antd 的文档编写

## 引入路由

- 下载包：`react-router-dom`
- 拆分应用路由：
  + `Login`：登录
  + `Admin`：后台管理界面
- 注册路由：
  + `<BrowserRouter>` / `<HashRouter>`
  + `<Switch>`
  + `<Route path="/xxx" component={ xxx } />`

## Login 的静态组件

1. 自定义了一部分样式布局
2. 使用 antd 的组件实现登录表单界面
  + `Form` / `Form.Item`
  + `Input`
  + `Icon`
  + `Button`

## 相关知识点

1. 区别开发环境运行和生产环境打包运行
2. 路由的理解
3. 在（点击）事件回调函数中使用 `this.props.history.replace('/login')` 进行路由跳转

## 收集表单数据和表单的前台验证

### 1. form 对象

- 如何让包含 <Form> 对象的组件得到 `form` 对象？
  + `WrapLoginForm = Form.create()(LoginForm)`
  + `WrapLoginForm` 是 `LoginForm` 的父组件，它给 `LoginForm` 传入 `form` 属性
  + 用到了高阶函数和高阶组件的技术

### 2. 操作表单数据

- `form.getFieldDecorator('标识名称', { initialValue: 初始值, rules: [] })(<Input/>)` 包装表单项标签
- `form.getFieldsValue()`: 得到包含所有输入数据的对象
- `form.getFieldValue(id)`: 根据标识得到对应字段输入的数据

### 3. 前台表单验证

- **声明式实时表单验证**：
  + `form.getFieldDecorator('标识名称', { rules: [{min: 4, message: '错误提示信息'}] })(<Input/>)`
- **自定义表单验证**：
  + `form.getFieldDecorator('标识名称', {rules: [{validator: this.validatePwd}]})(<Input/>)`

```js
validatePwd = (rule, value, callback) => {
  if(有问题) callback('错误提示信息') else callack()
}
```

- **点击登陆时统一验证**：

```js
form.validateFields((error, values) => {
  if(!error) {通过了验证, 发送ajax请求}
})
```

## 高阶函数

- 定义：接收的参数是函数，或者返回值是函数
- 常见的高阶函数：
  + 闭包
  + 数组遍历相关的方法
  + 定时器
  + Promise
  + 高阶组件
  + `fn.bind(obj)()`
    * 返回值是函数
- 作用：
  + 实现一个更加强大的，动态的功能

## 高阶组件

- 本质是一个函数
- 函数接收一个组件，返回一个新的组件
- `Form.create()` 返回的就是一个高阶组件

## 高阶组件与高阶函数的关系

- 高阶组件是特别的高阶函数
- 接收一个组件函数，返回是一个新的组件函数

## 后台应用

- 启动后台应用：`mongodb` 服务必须启动
- 使用 `Postman` 测试接口（根据接口文档）
  + 访问测试：`POST` 请求的参数在 `body` 中设置
  + 保存测试接口
  + 导出 / 导入所有测试接口

## 编写 `ajax` 代码

### 1. `ajax` 请求函数模块：`api / ajax.js`

- 封装 **axios**：`interceptor + promise`
  + 解决 `post` 请求参数后台不能读取问题：axios 默认以 `json` 形参传递请求体参数, 在请求拦截器中转换成 `urlencode` 形式
  + 请求成功的结果不再是 `response`, 而是 `reponse.data`：使用响应拦截器成功的回调返回 `response.data`
  + 内部统一处理请求异常：在响应拦截失败的回调中返回 `pending` 状态的 `promise`, 中断 `promise` 链

### 2. 接口请求函数模块：`api / index.js`

- 根据接口文档编写（一定要具备这个能力）
- 接口请求函数：调用 `ajax` 模块发请求，返回值 `promise` 对象

### 3. 解决 `ajax` 跨域请求问题（开发时）

- 办法：配置代理 -> 开发的配置不能用于生产环境
- 编码：`package.json`：`proxy: "http://localhost:5000"`

### 4. 你对代理的理解（了解）

#### 代理是什么？

- `webpack-dev-server`
  + `http-proxy-middleware`
- 具有特定功能的程序（工具包）

#### 运行在哪？

- 前台应用端，不在后台应用端
- 只能在开发时使用

#### 有什么作用？

- 解决开发时的 `ajax` 请求跨域问题
  + 监视拦截请求（3000）
  + 转发请求（5000）

#### 如何配置代理？

- 告诉代理一些信息：比如转发的目标地址
- 开发环境：前端工程师
- 生产环境：后端工程师

#### 跨域请求

- POST 请求不能用 `jsonp`

### 5. `async` / `await` 的理解和使用（重要）

#### 理解

- API 中 `index.js`
- 包含应用中所有请求接口的函数：接口请求函数
  + 函数的返回值都是 `Promise` 对象

#### 有什么作用？

- 简化 `Promise` 对象的使用：不再使用 `.then()` 来指定回调函数
  + 不再使用 `try {} catch (error) {}` 的接收出现异常时抛出的响应
- 能同步编码方式实现异步流程

#### 哪里使用 `await`？

- 写在返回 `Promise` 对象表达式左侧
  + 左侧的得到的不再是 `Promise`，而是 `Promise` 异步成功的值

#### 哪里使用 `async`

- `await` 所在最近的函数定义的左侧写 `async`

```js
async test() {
  // 成功的结果
  // return 1

  // 失败的结果
  throw 1
}

// 一个 async 返回的 Promise 的结果（值）由其内部的 return 决定
const xxx = await test()
```

## 实现登录（包含自动登录）

- `login.jsx`
  + 调用登录的接口请求
  + 如果失败了，显示错误信息提示
  + 如果成功了：
    * 保存到 `user` 到 `local` 以及 `内存` 中
    * 跳转到 `admin`
  + 如果内存中的 `user` 有值，自动跳转到 `admin`
    * 写在登录组件的 `render` 里面（最前面）
- `admin.jsx`
  + 判断如果内存中没有 `user(_id没有值)`，自动跳转到 `login`
- `storageUtils.js`
  + 包含使用 `localStorage` 来保存 `user` 相关操作的工具模块
    * 获取 / 设置 / 删除
  + 使用第三方库 `store`
    * 简化编码
    * 兼容不同的浏览器
- `memoryUtils.js`
  + 用来在内存中保存数据(user)的工具类
  + `user` 的初始值从 `local` 中读取
