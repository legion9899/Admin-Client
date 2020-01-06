import React, { Component } from 'react'
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import LinkButton from '../../components/LinkButton'
import AddUpdateForm from './add-update-form'
import './category.less'

/**
 * 分类管理
 */
export default class Category extends Component {
  state = {
    categorys: [], // 所有分类的列表（数组）
    loading: false, // 正在加载中
    showStatus: 0, // 0：不显示，1：显示添加，2：显示修改
  }
  // 初始化 table 的所有列信息的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => <LinkButton onClick={() => {
          this.category = category // 保存当前分类，以备在其它地方都可以读取到
          this.setState({
            showStatus: 2
          })
        }}>修改分类</LinkButton>
      },
    ] 
  }
  // 异步获取分类列表显示
  getCategorys = async () => {
    // 显示 loading
    this.setState({ loading: true })
    // 发送异步 ajax 请求
    const result = await reqCategorys()
    // console.log(result)
    // 隐藏 loading
    this.setState({ loading: false })
    if (result.status === 0) {
      // message.success('获取分类接口请求成功')
      // 取出分类列表
      const categorys = result.data
      // 更新状态 categorys 数据
      this.setState({
        categorys
      })
    } else {
      message.error('获取分类列表失败')
    }
  }
  // 点击模态框确定的回调：去添加/修改分类
  handleOk = () => {
    // 统一进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 验证通过后，得到输入数据
        const { categoryName } = values
        const { showStatus } = this.state

        // 解决块级作用域访问不到 result 的办法：
        let result
        if (showStatus === 1) {
          // 发添加分类的请求
          result = await reqAddCategory(categoryName)
        } else {
          const categoryId = this.category._id
          // console.log(categoryId)
          // 发修改分类的请求
          result = await reqUpdateCategory({ categoryId, categoryName })
        }

        // 重置输入数据（变成了初始值）
        // 解决修改数据后，再次点击别的数据发生冲突的问题
        this.form.resetFields()
        this.setState({ showStatus: 0 })

        // 确定提示名称
        const action = showStatus === 1 ? '添加' : '修改'

        // 根据响应结果，做不同处理
        if (result.status === 0) {
          // 重新获取分类列表显示
          this.getCategorys()
          message.success(action + '分类成功')
        } else {
          message.error(action + '分类失败')
        }
      }
    })
  }
  // 点击模态框取消的回调
  handleCancel = () => {
    // 重置输入数据（变成了初始值）
    // 解决修改数据后，再次点击添加接口输入框默认有数据的问题
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    // 取出状态数据
    const { categorys, loading, showStatus } = this.state
    // 读取分类的名称
    const category = this.category || {}
    // Card 右上角的结构
    const extra = (
      <Button type="primary" onClick={() => {
        /**
         * bug：如果先点击修改分类，再添加分类按钮，输入框会出现上一次修改分类的数据
         *  + 解决方案：不论何时，点击添加按钮前先把初始商品分类的数据设置为 null
         */
        this.category = null
        this.setState({ showStatus: 1 })
      }}>
        <Icon type="plus"/>
        添加
      </Button>
    )
    return (
      <Card extra={ extra }>
        <Table
          columns={ this.columns }
          dataSource={ categorys }
          loading={ loading }
          pagination={{ defaultPageSize: 6, showQuickJumper: true }}
          rowKey="_id"
          bordered
        />
        <Modal
          title={ showStatus === 1 ? "添加分类" : "修改分类" }
          visible={ showStatus !== 0 }
          onOk={ this.handleOk }
          onCancel={ this.handleCancel }
        >
          {/* 将子组件传递过来的 form 对象保存到当前组件的对象上 */}
          {/* 用 category.name 是因为接口返回的数据为 name */}
          <AddUpdateForm setForm={ form => this.form = form } categoryName={ category.name } />
        </Modal>
      </Card>
    )
  }
}
