import React, { Component } from 'react';
import { message } from 'antd';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

// 应用根组件

class App extends Component {
  handleClick = () => {
    message.success('成功啦...');
  }
  render() {
    return (
      // 换成 BrowserRouter 是为了在详情页得到从商品主页中 history.push 传递 state 属性
      <BrowserRouter>
        <Switch>
          {/* /home */}
          <Route path="/login" component={ Login } />
          <Route path="/" component={ Admin } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
