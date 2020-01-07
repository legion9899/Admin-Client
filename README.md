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

## LeftNav 组件

- 使用 `antd` 的组件
  + `Menu` / `Menu.Item` / `Menu.SubMenu`

- 使用 `react-router`
  + `withRouter()`: 包装非路由组件, 给其传入 `history` / `location` / `match` 属性
  + history: `push()` / `replace()` / `goBack()`
  + location: `pathname` 属性
  + match: `params` 属性

- `componentWillMount` 与 `componentDidMount` 的比较
  + **componentWillMount**: 在第一次 `render()` 前调用一次, 为第一次 `render()` 准备数据(同步)
  + **componentDidMount**: 在第一次 `render()` 之后调用一次, 启动异步任务, 后面异步更新状态重新 `render`

- 根据配置数据动态生成 `Item` 和 `SubMenu` 的数组
  + `map()` + 递归: 多级菜单列表
  + `reduce()` + 递归: 多级菜单列表

- 两个问题?
  + 刷新时如何选中对应的菜单项？
    * `selectedKey` 是当前请求的 `path`
  + 刷新子菜单路径时, 自动打开子菜单列表?
    * `openKey` 是一级列表项的某个子菜单项是当前对应的菜单项

## Header组件

- 界面静态布局
  + 三角形效果
- 获取登陆用户的名称显示
  + `MemoryUtils`
- 当前时间
  + 循环定时器, 每隔 1s 更新当前时间状态
  + 格式化指定时间: `dateUtils`
- 天气预报
  + 使用 `jsonp` 库发 `jsonp` 请求百度天气预报接口
  + 对 `jsonp` 请求的理解
- 当前导航项的标题
  + 得到当前请求的路由 `path: withRouter()` 包装非路由组件
  + 根据 `path` 在 `menuList` 中遍历查找对应的 `item` 的 `title`
- 退出登陆
  + `Modal` 组件显示提示
  + 清除保存的 `user`
  + 跳转到 `login`
- 抽取通用的类链接按钮组件
  + 通过 `...` 透传所有接收的属性: <Button {...props} />    <LinkButton>xxxx</LinkButton>
  + 组件标签的所有子节点都会成为组件的 `children` 属性
        
## `jsonp` 解决 `ajax` 跨域的原理

- jsonp 只能解决 GET 类型的 ajax 请求跨域问题
- jsonp 请求不是 ajax 请求, 而是一般的 GET 请求
- 基本原理
  + 浏览器端:
    * 动态生成 `<script>` 来请求后台接口(src就是接口的url)
    * 定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
  + 服务器端:
    * 接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
  + 浏览器端:
    * 收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据

## Category组件使用antd组件构建分类列表界面

- Card
- Table
- Button
- Icon
        
## 相关接口请求函数

- 获取分类列表
- 添加分类
- 更新分类
        
## 异步显示分类列表    

- 设计分类列表的状态: categorys
- 异步获取分类列表: componentDidMount(){}
- 更新状态显示

## 添加分类

- 界面
  + antd组件: Modal, Form, Select, Input
  + 显示/隐藏: showStatus状态为 1/0
- 功能
  + 父组(Category)件得到子组件(CategoryForm)的数据(form)
  + 调用添加分类的接口
  + 重新获取分类列表

## 更新分类

- 界面
  + antd组件: Modal, Form, Input
  + 显示/隐藏: showStatus状态为 2/0
- 功能
  + 父组(Category)件得到子组件(CategoryForm)的数据(form)
  + 调用更新分类的接口
  + 重新获取分类列表
- 重要问题
  + 描述: <Input>指定initialValue后, 如果输入改变了, 再指定新的initialValue, 默认显示输入的值
  + 解决: 在关闭Modal时, 进行表单项重置: form.resetFields()

## Product 整体路由

- 配置子路由: 
  + ProductHome / ProductDetail / ProductAddUpdate
  + <Route> / <Switch> / <Redirect>
- 匹配路由的逻辑:
  + 默认: 逐层路由不完全匹配 `<Route path='/product' component={ProductHome}/>`
  + exact属性: 完全匹配
        
## 分页实现技术(2种)

- 前台分页
  + 请求获取数据: 一次获取所有数据, 翻页时不需要再发请求
  + 请求接口: 
    * 不需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
    * 响应数据: 所有数据的数组
- 基于后台的分页
  + 请求获取数据: 每次只获取当前页的数据, 翻页时要发请求
  + 请求接口: 
    * 需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
    * 响应数据: 当前页数据的数组 + 总记录数(total)
- 如何选择?
  + 基本根据数据多少来选择

## ProductHome组件

- 分页显示
  + 界面: <Card> / <Table> / Select / Icon / Input / Button
  + 状态: products / total
  + 接口请求函数需要的数据: pageNum, pageSize
  + 异步获取第一页数据显示
    * 调用分页的接口请求函数, 获取到当前页的 products 和总记录数 total
    * 更新状态: products / total
  + 翻页:
    * 绑定翻页的监听, 监听回调需要得到 pageNum
    * 异步获取指定页码的数据显示  

## Array的声明式方法的实现

- map()
- reduce()
- filter()
- find() / findIndex()
- every() / some()

## 受控组件与非受控组件

- 有 `form` 表单项的组件

### 受控组件

- 自动收集数据，并且收集到状态里面

#### 设置好状态

#### 读取初始值进行显示，同时绑定 onChange 监听

#### 非受控组件

## ProductHome 组件

### 1. 搜索分页

- 接口请求函数需要的数据
  + pageSize：每页的条目数
  + pageNum：当前请求第几页（从1开始）
  + productDesc / productName：searchName 根据商品描述 / 名称搜索
- 状态：
  + searchType / searchName / 在用户操作的时候实时搜索数据
- 异步搜索显示分页列表
  + 如果 searchName 有值，调用搜索的接口请求函数获取数据并更新状态

### 2. 更新商品的状态

- 初始显示：
  + 根据 product 的 status 属性来显示  status = 1/2
- 点击切换：
  + 绑定点击监听
  + 异步请求更新状态

### 4. 进入详情界面

- memoryUtils.product = product
- history.push('/product/detail')

### 5. 进入添加界面

- memoryUtils.product = null
- history.push('/product/addupdate')

### 6. 进入修改界面

- memoryUtils.product = product
- history.push('/product/addupdate')

## ProductDetail 组件

1. 读取商品数据: memoryUtils.product
2. 显示商品信息: <Card> / List 
3. 异步显示商品所属分类的名称

## ProductAddUpdate 组件

### 1. 基本界面

- Card / Form / Input / TextArea / Button
- FormItem 的 label 标题和 layout

### 2. 分类下拉列表的异步显示

- **以下为基本套路**
- 初始状态的变量放在 state 状态内
- 在 render 内读取初始状态，不会显示列表
- 在 DidMount 中进行
  + 调用接口函数、得到数据、更新初始状态
  + 从而更新显示页面的数据

### 3. 表单数据收集与表单验证

## PicturesWall 组件

### 1. antd 组件

- Upload / Modal / Icon
- 根据示例 demo 改造编写

### 2. 上传图片

- 在 <Upload > 上配置接口的 path 和请求参数名
  + 在标签的属性上进行配置，指定 path 路径和参数名
  + 至于详情配置什么去查看相关 API 文档
- 监视文件状态的改变: 上传中 `uploading` / 上传完成 `done` / 删除 `removed`
  + 在 `status` 保存的上传状态
  + 当它改变的时候的监听回调
    * `onChange`:`this.handleChange`
- 在上传成功时, 保存好相关信息: name / url
  + 上传新文件成功的时候，有两个东西和文件对应
  + `file` 和 files 里面的最后一个 file
  + 这两个对象都和我们上传的文件对应，但不是同一个
- 为父组件提供获取已上传图片文件名数组的方法

### 3. 删除图片

- 当文件状态变为删除时, 调用删除图片的接口删除上传到后台的图片

### 4. 父组件调用子组件对象的方法: 使用 ref 技术

- 创建 ref 容器: `this.pw = React.createRef()`
- 将 ref 容器交给需要获取的标签元素: <PicturesWall ref={this.pw} />  // 自动将将标签对象添加为pw对象的current属性
- 通过 ref 容器读取标签元素: this.pw.current
