import React, { Component } from 'react';
import { Button, message } from 'antd';
import { HashRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

// 应用根组件

class App extends Component {
  handleClick = () => {
    message.success('成功啦...');
  }
  render() {
    return (
      <HashRouter>
        {/* <Button type="primary" onClick={ this.handleClick }>学习</Button> */}
        <Switch>
          <Route path="/login" component={ Login } />
          <Route path="/" component={ Admin } />
        </Switch>
      </HashRouter>
    )
  }
}

export default App;
