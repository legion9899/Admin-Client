import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { increment, decrement } from './redux/actions'

/* 应用根组件 */
class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  
  increment = () => {
    console.log('增加')
    const number = this.refs.numberSelect.value * 1
    this.props.store.dispatch(increment(number))
  }
  
  deincrement = () => {
    console.log('减少')
    const number = this.refs.numberSelect.value * 1
    this.props.store.dispatch(decrement(number))
  }

  incrementIfOdd = () => {
    console.log('如果是奇数就增加')
    const count = this.props.store.getState()
    const number = this.refs.numberSelect.value * 1
    if (count % 2 !== 0) {
      this.props.store.dispatch(increment(number))
    }
  }

  incrementAsync = () => {
    console.log('异步增加')
    const number = this.refs.numberSelect.value * 1
    setTimeout(() => {
      this.props.store.dispatch(increment(number))
    }, 1000)
  }

  render() {
    console.log('App render()')
    const count = this.props.store.getState()
    return (
      <div>
        <p>click {count} times</p>
        <select ref="numberSelect">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={ this.increment }>+</button>
        <button onClick={ this.deincrement }>-</button>
        <button onClick={ this.incrementIfOdd }>increment if odd</button>
        <button onClick={ this.incrementAsync }>increment async</button>
      </div>
    )
  }
}

export default App;
