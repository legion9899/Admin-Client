import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递 form 对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { roles, user } = this.props
    const { getFieldDecorator } = this.props.form

    // 指定 Item 布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧 label 的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form { ...formItemLayout }>
         <Item label='用户名'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, message: '必须输入用户名' }
              ]
            })(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        {/* 修改不显示密码 */}
        {
          user._id ? null : (
            <Item label="密码">
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                  rules: [
                    { required: true, message: '必须输入密码' }
                  ]
                })(
                  <Input type="password" placeholder="请输入密码" />
                )
              }
            </Item>
          )
        }
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                { required: true, message: '必须输入手机号' }
              ]
            })(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
            })(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id || '',
              rules: [
                { required: true, message: '必须指定角色' }
              ]
            })(
              <Select>
                <Option value="">未选择</Option>
                {
                  roles.map(role => (
                    <Option key={ role._id } value={ role._id }>
                      { role.name }
                    </Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)
