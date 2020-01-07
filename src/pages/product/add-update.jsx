import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button } from 'antd'
import { reqCategorys } from '../../api'
import PicturesWall from './pictures-wall'
import LinkButton from '../../components/LinkButton'
import memoryUtils from '../../utils/memoryUtils'
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

/*
商品添加/更新的路由组件
*/
class ProductAddUpdate extends Component {
  constructor(props) {
    super(props);
    // 创建 ref 容器，并保存到组件对象
    this.pwRef = React.createRef();
  }
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
  /*
    处理提交的回调函数
  */
  handleSubmit = e => {
    // 阻止事件的默认行为：阻止表单自动提交
    e.preventDefault();
    // console.log('提交按钮')

    // 进行统一的表单验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { name, desc, price, categoryId } = values
        console.log('发送请求：', name, desc, price, categoryId)

        // 收集上传的图片文件名的数组
        const imgs = this.pwRef.current.getImgs()
        console.log('imgs:', imgs)
      }
    })
  }
  // 对商品价格进行自定义验证
  validatePrice = (rule, value, callback) => {
    // 必须输入
    // 不能为负数
    // 必须是数字、小数点组成
    value = value.trim()
    if (!value) {
      callback('价格不能为空')
    } else if (value * 1 <= 0) {
      // callback('价格不能为零或负数')
      callback('价格必须大于零')
    } else if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value)) {
      callback('请输入正确的产品价格：整数或者保留两位小数')
    } else {
      // 不传验证条件，验证通过
      callback()
    }
  }
  componentWillMount() {
    this.product = memoryUtils.product

    // if (this.product._id) {
    //   this.isUpdate = true
    // } else {
    //   this.isUpdate = false
    // }

    // 双取反：`!! === Boolean()`
    this.isUpdate = !!this.product._id
  }
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    const { isUpdate, product } = this
    const { categorys } = this.state
    const { getFieldDecorator } = this.props.form

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack() }>
          <Icon type="arrow-left"/>
        </LinkButton>
        <span>{ isUpdate ? '修改商品' : '添加商品' }</span>
      </span>
    )

    // 指定表单 Form 中所有 Item 的布局
    const formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 }
    }

    return (
      <Card title={ title } className="add-update">
        <Form { ...formLayout }
          onSubmit={ this.handleSubmit }
        >
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                { required: true, message: '必须输入商品名称！' }
              ],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                { required: true, message: '必须输入商品描述！' }
              ],
            })(<TextArea placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                // { required: true, message: '必须输入商品价格！' }
                { required: true, validator: this.validatePrice }
              ],
            })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" />)}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue: product.categoryId || '',
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
            {/* 获取标签对象：用 ref 技术 */}
            {/* 
              将容器交给需要标记的标签对象，
              在解析时就会自动将标签对象保存到容器中
              （属性名为：current，属性值为：标签对象）
            */}
            <PicturesWall ref={ this.pwRef } imgs={ product.imgs } />
          </Item>
          <Item label="商品详情" wrapperCol= {{ span: 20 }}>
            <RichTextEditor detail={ product.detail } />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)