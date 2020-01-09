import React, {Component} from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/LinkButton'
import { reqAddOrUpdateUser, reqUsers, reqDeleteUser } from '../../api'
import UserForm from './user-form'

/**
 * 用户管理
 */
export default class User extends Component {
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate,
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        // render: role_id => this.state.roles.find(role => role._id === role._id).name
        render: role_id => this.roleNames[role_id] // 因为需要 role 中的 id 去找 role 中的 name
        /**
         * + 列表用数组存数据
         * + 如果有某一数据的标识数据，想根据标识数据查找数据本身或其他数据，
         *    这个时候就用对象来存数据（这样是为了提高效率，不用数组进行遍历）
         */
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user) }>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user) }>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  /* 显示添加界面 */
  showAdd = () => {
    this.user = null // 去除前面保存的 user
    this.setState({
      isShow: true
    })
  }

  /* 显示修改界面 */
  showUpdate = (user) => {
    this.user = user // 保存 user
    this.setState({
      isShow: true
    })
  }

  /* 删除指定用户 */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${ user.username }吗？`,
      onOk: async () => {
        // 点击确定，发送删除该用户的请求
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        } else {
          message.error(result.msg)
        }
      }
    })
  }

  /* 添加 / 更新用户 */
  addOrUpdateUser = async () => {

    // 对表单所有字段进行统一的验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 如果 this 有 user
        if (this.user) {
          values._id = this.user._id
        }

        // 如果 values 有 _id 就是修改，没有就是添加
        const result = await reqAddOrUpdateUser(values)
        if (result.status === 0) {
          message.success('添加 / 修改用户成功')
          this.setState({ isShow: false })
          this.getUsers()
        } else {
          message.error(result.msg)
        }
      }
    })
  }

  /* 获取用户列表 */
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data

      // 生成一个对象容器（属性名：角色的 id 值，属性值角色的名称）
      this.roleNames = roles.reduce((pre, role) => {
        pre[role._id] = role.name // 存的对象地址值，占用空间比较小
        return pre
      }, {})

      this.setState({
        users,
        roles
      })
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const { users, roles, isShow } = this.state
    const user = this.user || {}

    const title = (
      <Button type="primary"
        onClick={ this.showAdd }
      >
        创建用户
      </Button>
    )

    return (
      <Card title={ title }>
        <Table 
          bordered
          rowKey="_id"
          dataSource={ users }
          columns={ this.columns }
          pagination={{ defaultPageSize: 2 }}
        />
        <Modal
          title={ user._id ? '修改用户' : '添加用户' }
          visible={ isShow }
          onOk={ this.addOrUpdateUser }
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm
            setForm={ form => this.form = form }
            roles={ roles }
            user={ user }
          />
        </Modal>
      </Card>
    )
  }
}
