import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu

/**
 * 左侧导航组件
 */
class LeftNav extends Component {
  /*
    先判断用户有没有对应的 item 权限，再往进添加
  */
  hasAuth = (item) => {
    // 先得到当前用户的所有权限
    const user = memoryUtils.user
    const menus = user.role.menus
    
    // 1. 如果当前用户是 admin

    // 2. 如果 item 是公开的

    // 3. 当前用户有此 item 权限

    if (user.username === 'admin' || item.public || menus.indexOf(item.key) !== -1) {
      return true
    } else if (item.children) {
      // 如果当前用户有 item 的某个子节点的权限，当前 item 也应该显示
      const cItem = item.children.find(cItem => menus.indexOf(cItem.key) !== -1)
      return !!cItem // 如果 cItem 有值，返回 true
    }
    return false
  }

  // 根据指定 menu 数据数组生成 <Menu.Item> 和 <SubMenu> 的数组
  // reduce + 函数递归
  getMenuNodes2 = (menuList) => {
    // const array1 = [1, 2, 3, 4]
    // const total = array1.reduce((preTotal, item) => {
    //   // 遍历的回调函数，并且在进行统计的操作，必须返回当次统计的结果

    //   // 加奇数
    //   return preTotal + (item % 2 === 1 ? item : 0)
    // }, 0)

    // 请求的路径 path
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {
      // 先判断用户有没有对应的 item 权限，再往进添加
      if (this.hasAuth(item)) {
        // 可能向 pre 中添加 <Menu.Item>
        if (!item.children) {
          pre.push(
            <Menu.Item key={ item.key }>
              <Link to={ item.key }>
                <Icon type={ item.icon } />
                <span>{ item.title }</span>
              </Link>
            </Menu.Item>
          )
        } else {

          /*
            判断当前 item 的 key 是否是我需要的 openKey
              + 查找 item 中的所有 children 中的 cItem 的 key
              + 看是否有一个跟请求的 path 匹配
          */

          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)

          if (cItem) {
            // debugger
            this.openKey = item.key
          }

          // 也可能向 pre 中添加 <SubMenu>
          pre.push(
            <SubMenu
              key={ item.key }
              title={
                <span>
                  <Icon type={ item.icon } />
                  <span>{ item.title }</span>
                </span>
              }
            >
              {/* 递归遍历 */}
              { this.getMenuNodes2(item.children) }
            </SubMenu>
          )
        }
      }

      
      return pre
    }, [])
  }
  // 根据指定 menu 数据数组生成 <Menu.Item> 和 <SubMenu> 的数组
  // map + 函数递归
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={ item.key }>
            <Link to={ item.key }>
              <Icon type={ item.icon } />
              <span>{ item.title }</span>
            </Link>
          </Menu.Item>
        )
      }
      return ( // 有下一级菜单项
        <SubMenu
          key={ item.key }
          title={
            <span>
              <Icon type={ item.icon } />
              <span>{ item.title }</span>
            </span>
          }
        >
          {/* 递归遍历 */}
          { this.getMenuNodes(item.children) }
        </SubMenu>
      )
    })
  }
  // 第一次 render() 之前执行一次
  // 为第一次 render() 做一些同步准备
  componentWillMount() {
    this.menuNodes = this.getMenuNodes2(menuList)
  }
  // 第一次 render() 之后执行一次
  // 执行异步任务：发 ajax 请求，启动定时器
  componentDidMount() {
    // this.menuNodes = this.getMenuNodes2(menuList)
  }
  render() {
    console.log('left-nav render()')
    // 得到当前请求的路由路径
    
    // 非路由组件没有路由对象，所以要用 withRouter 处理抛出的组件
    let selectKey = this.props.location.pathname

    /**
     * bug：解决左侧导航栏弹出二级页面时选中失效的问题
     *  + 监控 /product 的路由匹配，进入二级路由时让 selectKey 等于一级路径
     */
    if (selectKey.indexOf('/product') === 0) {
      selectKey = '/product'
    }

    console.log('selectKey', selectKey)
    console.log('openKey', this.openKey)

    return (
      <div className="left-nav">
        <Link className="left-nav-header" to="/home">
          <img src={ logo } alt="logo"/>
          {/* <h1>大清禁卫</h1> */}
          <h1>Admin-Client</h1>
        </Link>
        {/*
          defaultSelectedKeys：总是根据第一次指定的 key 进行显示
          selectedKeys：总是根据最新指定的 key 进行显示
        */}
        <Menu
          selectedKeys={[selectKey]}
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark"
        >
          { this.menuNodes }
        </Menu>
      </div>
    )
  }
}

// 向外暴漏 LeftNav，使用高阶组件 withRouter() 来包装非路由组件
// 新组件向 LeftNav 传递三个特别属性 history / location / match
// 结果：LeftNav 可以操作路由相关语法了
export default withRouter(LeftNav)

/**
 * busList：
 *  1. 默认选中对应的 Menu.Item
 *  2. 有可能需要默认打开某个 SubMenu
 *    + 访问的是某个二级菜单项对应的 pathname
 */
