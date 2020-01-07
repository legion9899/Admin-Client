import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils.js'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { reqWeather } from '../../api'
import LinkButton from '../LinkButton'
import './index.less'

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: '', // 图片 url
    weather: '', // 天气文本
  }
  // 登出
  logout = () => {
    // 先显示一个确认提示
    Modal.confirm({
      title: '确认退出吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        console.log('OK')
        // 确定后，删除存储的用户信息
        // local 中的
        storageUtils.removeUser()
        // 内存中的
        memoryUtils.user = {}

        // 跳转到登录页面
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 根据当前请求的 path 得到对应的 title 
  getTitle = () => {
    let title = ''
    const path = this.props.location.pathname
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        /*
          bug：解决头部标题在二级界面内不显得问题
            + 只判断一级路径，如果对应上就能出现头部标题
            + 处理方式和左侧导航栏一样：path.indexOf(cItem.key) === 0
        */
        const cItem =  item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }
  // 获取天气信息显示
  getWeather = async () => {
    // 发送请求
    const { dayPictureUrl, weather } = await reqWeather('北京')
    // console.log(dayPictureUrl, weather)
    // 更新状态
    this.setState({
      dayPictureUrl,
      weather
    })
  }
  componentDidMount() {
    // 启动循环定时器
    this.intervalId = setInterval(() => {
      // 将 currentTime 更新为当前时间值
      this.setState({
        currentTime: formateDate(Date.now())
      })
    }, 1000);
    // 发 jsonp 请求，获取天气信息显示
    this.getWeather()
  }
  // Unmounting 销毁
  // 在组件从 DOM 中移除之前立刻被调用
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId)
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state
    // 读取内存中的用户信息
    const user = memoryUtils.user
    // 得到当前需要显示的 title
    const title = this.getTitle()
    return (
      <header>
        <div className="header-top">
          欢迎，{ user.username }
          {/* 组建的标签体作为标签的 children 属性传入 */}
          <LinkButton onClick={ this.logout }>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{ title }</div>
          <div className="header-bottom-right">
            <span>{ currentTime }</span>
            <img src={ dayPictureUrl } alt="weather"/>
            <span>{ weather }</span>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(Header)
