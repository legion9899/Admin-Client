import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/LinkButton'
import { PAGE_SIZE } from '../../utils/Constants' // 常量
import AuthForm from './auth-form'
import AddForm from './add-form'
import { formateDate } from '../../utils/dateUtils' // 格式化日期
import memoryUtils from '../../utils/memoryUtils'
import { reqAddRole, reqUpdateRole, reqRoles } from '../../api'

/**
 * 角色管理
 */
export default class Role extends Component {
  state = {
    roles: [], // 所有角色的列表
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }
  constructor(props) {
    super(props)

    this.authRef = React.createRef()
  }
  /* 初始化 table 列数组 */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // 转换时间格式
        // render: create_time => formateDate(create_time)
        render: formateDate, // 少套一层函数，并且 formateDate 接收的就是转换时间格式的回调函数，所以可以简写
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        // 转换时间格式
        render: formateDate,
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={() => this.showAuth(role) }>设置权限</LinkButton>
      },
    ]
  }

  /* 显示权限设置见面 */
  showAuth = (role) => {
    // 将当前需要设置的角色保存到组件对象上
    this.role = role
    this.setState({
      isShowAuth: true
    })
  }

  /* 异步获取角色列表显示 */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  /* 添加角色 */
  addRole = () => {
    // 进行表单验证，只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({
          isShowAdd: false
        })

        // 发送 ajax 请求
        const result = await reqAddRole(values.roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          const role = result.data
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
          // this.getRoles() // 获取最新的角色列表
        } else {
          message.error(result.msg)
        }
      }
    })
  }

  /*
    给角色授权
  */
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    })

    const { role } = this

    // 更新角色（role 对象）相关信息
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username

    // 请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('角色授权成功')
      // 重新获取角色列表
      this.getRoles()
    } else {
      message.error(result.msg)
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    console.log('role render()')
    const { roles, isShowAdd, isShowAuth } = this.state
    const role = this.role || {}

    const title = (
      <Button type='primary' onClick={() => this.setState({
        isShowAdd: true
      })}>
        创建角色
      </Button>
    )

    return (
      <Card title={ title }>
        <Table
          bordered
          rowKey="_id"
          dataSource={ roles }
          columns={ this.columns }
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加角色"
          visible={ isShowAdd }
          onOk={ this.addRole }
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={ (form) => this.form = form }
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={ isShowAuth }
          onOk={ this.updateRole }
          onCancel={() => {
            this.setState({
              isShowAuth: false
            })
          }}
        >
          <AuthForm ref={ this.authRef } role={ role } />
        </Modal>
      </Card>
    )
  }
}
