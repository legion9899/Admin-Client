import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button } from 'antd'
import LinkButton from '../../components/LinkButton'
import { reqCategorys } from '../../api'

const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

/*
商品添加/更新的路由组件
*/
class ProductAddUpdate extends Component {
  state = {
    categorys: []
  }
  getCategorys = async () => {
    const result = await reqCategorys()
    if (result.status === 0) {
      const categorys = result.data
      this.setState({ categorys })
    }
  }
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    const { categorys } = this.state
    const { getFieldDecorator } = this.props.form

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack() }>
          <Icon type="arrow-left"/>
        </LinkButton>
        <span>添加商品</span>
      </span>
    )

    // 指定表单 Form 中所有 Item 的布局
    const formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 }
    }

    return (
      <Card title={ title } className="add-update">
        <Form { ...formLayout }>
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                { required: true, message: '必须输入商品名称！' }
              ],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue: '',
              rules: [
                { required: true, message: '必须输入商品描述！' }
              ],
            })(<TextArea placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue: '',
              rules: [
                { required: true, message: '必须输入商品价格！' }
              ],
            })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" />)}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue: '',
              rules: [
                { required: true, message: '必须选择商品分类！' }
              ],
            })(
              <Select>
                <Option value="">未选择</Option>
                {
                  categorys.map(item => <Option value={ item._id } key={ item._id }>{ item.name }</Option>)
                }
              </Select>
            )}
          </Item>
          <Item label="商品图片">
            <div>这里是商品图片组件</div>
          </Item>
          <Item label="商品详情">
            <div>这里是商品详情组件</div>
          </Item>
          <Item>
            <Button type="primary">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)