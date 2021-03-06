import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'

/*
  用来添加角色的 form 组件
*/
const Item = Form.Item
const { TreeNode } = Tree

/* 添加分类的 form 组件 */
export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys: [] // 存储权限勾选的状态
  }

  getMenus = () => this.state.checkedKeys

  /*
    根据菜单配置生成 <TreeNode> 的数组
  */
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={ item.title } key={ item.key }>
          { item.children ? this.getTreeNodes(item.children) : null }
        </TreeNode>
      )
      return pre
    }, []) // 初始值看结果，结果是数组，所以初始值为空数组
  }

  /*
    进行勾选操作时的回调函数
    checkedKeys：最新的所有勾选的 node 的 key 的数组
  */
  handleCheck = (checkedKeys) => {
    // 更新状态
    this.setState({
      checkedKeys
    })
  }

  componentWillMount() {
    // console.log('componentWillMount()') // 只执行一次

    this.treeNodes = this.getTreeNodes(menuList)

    // 根据传入角色的 menus 来更新 checkedKeys 状态
    const menus = this.props.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  /*
    组件接收到新的标签属性时就会执行（初始显示是不会调用）
    nextProps：接收到的包含新的属性的对象
  */
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps()', nextProps)

    // 根据传入角色的 menus 来更新 checkedKeys 状态
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render() {
    // console.log('auth-form render()')
    const { role } = this.props
    const { checkedKeys } = this.state

    // 指定 Item 布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧 label 的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <div className="auth-form">
        <Item label="角色名称" { ...formItemLayout }>
          <Input value={ role.name } disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={ checkedKeys }
          onCheck={ this.handleCheck }
        >
          <TreeNode title="平台权限" key="all">
            { this.treeNodes }
          </TreeNode>
        </Tree>
      </div>
    )
  }
}
