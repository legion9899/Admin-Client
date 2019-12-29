import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import logo from './images/logo.jpg'
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
    this.props.form.validateFields((err, { username, password }) => {
      if (!err) {
        alert(`发送登录的 ajax 请求，username=${ username }，password=${ password }`)
      } else {
        // alert('验证失败')
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
    } else if (value.length > 12) {
      callback('密码不能大于 12 位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      // 不传验证条件，验证通过
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <div className="login-header">
          <img src={ logo } alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {/* 高阶函数 */}
              {getFieldDecorator('username', { // 配置对象：属性名是一些特定的名称
                /* 
                  用户名/密码的合法性要求：
                    + 必须输入
                    + 必须大于等于 4 位
                    + 必须小于等于 12 位
                    + 必须是英文、数字或下划线组成
                */
                initialValue: '', // 初始值
                rules: [ // 声明式验证：使用插件已定义好的规则进行验证
                  { required: true, whitespace: true, message: '请输入你的用户名' },
                  { min: 4, message: '用户名不能小于 4 位' },
                  { max: 12, message: '用户名不能大于 12 位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
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
