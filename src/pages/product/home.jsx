import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
// 函数节流，优化频繁触发更新上下架状态
import throttle from 'lodash.throttle'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import LinkButton from '../../components/LinkButton'
import { PAGE_SIZE } from '../../utils/Constants'
import memoryUtils from '../../utils/memoryUtils'

const Option = Select.Option

/*
  商品管理的首页组件
*/
export default class ProductHome extends Component {
  state = {
    loading: false, // 正在加载中
    products: [], // 商品列表
    total: 0, // 商品总数量
    searchType: 'productName', // 默认是根据商品名称搜索
    searchName: '', // 搜索的关键字
  }
  // 函数节流：两秒之内不得重复点击更新上下架状态功能
  updateStatus = throttle(async (productId, status) => {
    // 获取更新后的值，改变状态
    status = status === 1 ? 2 : 1
    // 请求更新
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品状态成功')
      // 更新完毕数据，获取当前页最新信息进行显示，不能写 1
      this.getProducts(this.pageNum)
    }
  }, 2000)
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '商品价格',
        dataIndex: 'price',
        // 显示的数据不是数据本身的时候，用 render
        render: (price) => '￥' + price
      },
      {
        title: '商品状态',
        // dataIndex: 'status',
        render: ({ _id, status }) => {
          let btntText = '下架'
          let text = '在售'
          if (status === 2) {
            btntText = '上架'
            text = '已下架'
          }
          return (
            <span>
              <Button type="primary" onClick={() => this.updateStatus(_id, status) }>{ btntText }</Button>
              <span>{ text }</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => (
          <span>
            <LinkButton
              onClick={() => {
                // 跳转前在内存中保存 product，为了给详情页展示对应数据使用
                memoryUtils.product = product
                this.props.history.push('/product/detail')
              }
            }>
              详情
            </LinkButton>
            <LinkButton
              onClick={() => {
                // 跳转前在内存中保存 product，为了在修改时展示对应数据使用
                memoryUtils.product = product
                this.props.history.push('/product/addupdate')
              }
            }>修改</LinkButton>
          </span>
        )
      },
    ]
  }
  // 异步获取指定页码商品分页（可能带搜索）列表显示
  getProducts = async (pageNum) => {
    // 保存当前请求的页码
    this.pageNum = pageNum
    // console.log('this.props.history:', this.props.history)
    const { searchName, searchType } = this.state

    /*
      bug：在商品管理搜索框内有内容，但是用户没有点击搜索按钮的情况下，去点击上下架功能以及分页功能的时候
          如果用 !searchName 来进行判断，在操作完毕自动获取最新列表数据的时候，会出现搜索结果的内容

      解决方案：
        - 只有在用户点击了搜索按钮的情况下，才进行搜索结果的呈现
        - 在 this 中存储一个搜索状态 isSearch，并在用户进行上下架以及分页操作触发请求之前，
        - 使用 !this.isSearch 进入如下判断:
          + this 中一开始没有 isSearch，结果为 undefined，会发送一般的获取数据的请求
          + 否则发送搜索的请求，并且在页面没有刷新的情况下，进行切换页面不会看到和搜索结果不符合的内容
    */

    let result
    if (!this.isSearch) {
      // 如果 isSearch 为 undefined 就进入搜索商品的请求
      // 没参数，发请求获取数据
      result = await reqProducts(pageNum, PAGE_SIZE)
    } else {
      // 如果 isSearch 为 true，取反就进入搜索商品的请求
      // 有参数，发送搜索请求获取数据
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, searchName })
    }
    // console.log(result)
    if (result.status === 0) {
      // 取出数据
      const { total, list } = result.data
      // 更新状态
      this.setState({
        products: list,
        total
      })
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    // 获取第一页显示
    this.getProducts(1)
  }
  render() {
    const { products, loading, total, searchType, searchName } = this.state
    const title = (
      <span>
        <Select
          style={{ width: 120 }}
          value={ searchType }
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          style={{ width: 200, margin: '0 10px' }}
          placeholder="关键字"
          value={ searchName }
          onChange={e => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => {
          // 保存搜索的标记
          this.isSearch = true
          // 获取第一页的列表
          this.getProducts(1)
        }}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary"
        onClick={() => {
          memoryUtils.product = {}
          this.props.history.push('/product/addupdate')
        }}
      >
        <Icon type="plus"/>
        添加商品
      </Button>
    )
    return (
      <Card title={ title } extra={ extra }
      >
        <Table
          columns={ this.columns }
          dataSource={ products }
          loading={ loading }
          pagination={
            {
              total,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              onChange: this.getProducts,
              current: this.pageNum
            }
          }
          rowKey="_id"
          bordered
        />
      </Card>
    )
  }
}
