import React, { Component } from 'react'
import { Redirect, Switch , Route } from 'react-router-dom'
import { Layout } from 'antd'
// 获取在内存中存储的用户登录信息
import memoryUtils from "../../utils/memoryUtils"
import LeftNav from '../../components/LeftNav'
import Header from '../../components/Header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import './admin.less'

const { Footer, Sider, Content } = Layout
export default class Admin extends Component {
  render() {
    // 渲染 admin 的时候，先进行验证
    // 读取保存的 user 信息，如果不存在，直接跳转到登录界面
    // 提前准备一个空对象，如果没有 user_key，在 JSON.parse 的时候不至于会报错
    const user = memoryUtils.user
    console.log(user)
    if (!user._id) {
      // 在（点击）事件回调函数中使用 `this.props.history.replace('/login')` 进行路由跳转

      // 在 render 函数中使用 Redirect 进行重定向
      // 跳转到指定的路由路径
      return <Redirect to="/login"/>
    }

    return (
      <Layout className="admin">
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content>
            <Switch>
              <Route path='/home' component={ Home }/>
              <Route path='/category' component={ Category }/>
              <Route path='/product' component={ Product }/>
              <Route path='/role' component={ Role }/>
              <Route path='/user' component={ User }/>
              <Route path='/charts/bar' component={ Bar }/>
              <Route path='/charts/line' component={ Line }/>
              <Route path='/charts/pie' component={ Pie }/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer>
            推荐使用<a href="https://www.google.cn/chrome/" target="_blank" rel="noopener noreferrer">谷歌浏览器</a>，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
