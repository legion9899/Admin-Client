import React, { Component } from 'react'
import { Card, Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

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
      <Card>
        <Form { ...formItemLayout }>
          {
            user._id ? null : <Item label="密码">
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
          }
        </Form>
      </Card>
    )
  }
}

export default Form.create()(UserForm)
