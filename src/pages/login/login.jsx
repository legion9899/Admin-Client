import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from '../../utils/storageUtils'
// 分别暴露必须使用大括号
import { reqLogin } from '../../api/index' // 接口请求函数
import logo from '../../assets/images/logo.png'
import './login.less'

const Item = Form.Item

class Login extends Component {
  // 提交
  handleSubmit = e => {
    // 阻止事件的默认行为：阻止表单自动提交
    e.preventDefault();

    // 取出输入的相关的数据
    // const form = this.props.form
    // const values = form.getFieldsValue()
    // const username = form.getFieldValue('username')
    // const password = form.getFieldValue('password')
    // console.log(values, username, password)

    // 对表单所有字段进行统一的验证
    this.props.form.validateFields(async (err, { username, password }) => {
      if (!err) {
        // .then 中需要用：try {} catch (error) {} 来捕获错误
        const result = await reqLogin(username, password)
        // console.log(result)
        // 判断状态码 status
        if (result.status === 0) {
          // 验证成功后，将 user 信息保存到 local 中
          const user = result.data
          // localStorage.setItem('user_key', JSON.stringify(user))

          // 在 localStorage 中保存的同时，要在本地也要保存一份
          storageUtils.saveUser(user)
          memoryUtils.user = user

          // 跳转到管理页面
          this.props.history.replace('/')
          message.success('登陆成功')
        } else {
          message.error(result.msg)
        }
      } else {
        message.error('用户输入有误，请重试')
      }
    })
  }
  // 对密码进行自定义验证
  validatePwd = (rule, value, callback) => {
    // 必须输入
    // 必须大于等于 4 位
    // 必须小于等于 12 位
    // 必须是英文、数字或下划线组成
    value = value.trim()
    if (!value) {
      callback('密码不能为空')
    } else if (value.length < 4) {
      callback('密码不能小于 4 位')
    } else if (value.length > 14) {
      callback('密码不能大于 14 位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      // 不传验证条件，验证通过
      callback()
    }
  }
  render() {
    // 读取保存的 user 信息，如果不存在，直接跳转到管理界面
    // const user = JSON.parse(localStorage.getItem('user_key') || '{}')
    const user = memoryUtils.user
    // console.log(user)
    if (user._id) {
      // 在（点击）事件回调函数中使用 `this.props.history.replace('/login')` 进行路由跳转

      // 在 render 函数中使用 Redirect 进行重定向
      // 跳转到指定的路由路径
      return <Redirect to="/" />
    }

    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <div className="login-header">
          <img src={ logo } alt="logo"/>
          <h1>大清帝国禁卫军管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {/* 高阶函数 */}
              {getFieldDecorator('username', { // 配置对象：属性名是一些特定的名称
                // 必须输入
                // 必须大于等于 4 位
                // 必须小于等于 12 位
                // 必须是英文、数字或下划线组成
                initialValue: '', // 初始值
                rules: [ // 声明式验证：使用插件已定义好的规则进行验证
                  { required: true, whitespace: true, message: '请输入你的用户名' },
                  { min: 4, message: '用户名不能小于 4 位' },
                  { max: 14, message: '用户名不能大于 14 位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  autoComplete="username"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                initialValue: '', // 初始值
                rules: [
                  // { required: true, message: '请输入你的密码！' },
                  { validator: this.validatePwd }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  autoComplete="current-password"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Item>
          </Form>
        </div>
      </div>
    )
  }
}

/*
  理解 Form 组件：
  - 包含 <Form> 标签的组件称为 Form 组件
  - 利用 Form.create() 包装 Form 组件，生成一个新的组件
  - 新组件会向 Form 组件传递一个强大的属性：form（属性名）
    + 它的属性值是一个对象，里面有各种各样的方法
*/
const WrapperForm = Form.create()(Login)

export default WrapperForm // <Form(Login)/>
