import React, { Component } from 'react';

/* 应用根组件 */
class App extends Component {
  state = {
    count: 0,
  }

  increment = () => {
    console.log('增加')
    const number = this.refs.numberSelect.value * 1
    this.setState({
      count: this.state.count + number,
    })
  }
  
  decrement = () => {
    console.log('减少')
    const number = this.refs.numberSelect.value * 1
    this.setState({
      count: this.state.count - number,
    })
  }

  incrementIfOdd = () => {
    console.log('如果是奇数就增加')
    const count = this.state.count
    const number = this.refs.numberSelect.value * 1
    if (count % 2 !== 0) {
      this.setState({
        count: count + number,
      })
    }
  }

  incrementAsync = () => {
    console.log('异步增加')
    const number = this.refs.numberSelect.value * 1
    setTimeout(() => {
      this.setState({
        count: this.state.count + number
      })
    }, 1000)
  }

  render() {
    const { count } = this.state
    return (
      <div>
        <p>click {count} times</p>
        <select ref="numberSelect">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={ this.increment }>+</button>
        <button onClick={ this.decrement }>-</button>
        <button onClick={ this.incrementIfOdd }>increment if odd</button>
        <button onClick={ this.incrementAsync }>increment async</button>
      </div>
    )
  }
}

export default App;
