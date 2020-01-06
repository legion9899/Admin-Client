import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

/* 
  添加/修改分类的 Form 组件
*/
class AddUpdateForm extends Component {
  // 用 static 声明给函数对象（将函数作为对象使用：`xxx.fn = {}`） AddUpdateForm 中添加 propTypes 属性
  // 如果不用 static 就是给实例（组件对象）添加
  static propTypes = {
    // 用 func 不用 function，因为 function 是关键字
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.string,
  }
  componentWillMount() {
    // 将 form 传递给父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { categoryName } = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '',
              rules: [
                { required: true, message: '分类名称必须输入' }
              ]
            })(
              <Input type="text" placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)
