/**
 * redux 真正管理状态数据的函数
 * 作用：根据老的 state 和 action，产生新的 state
 */

import * as types from './action-types'

export default function count(state = 1, action) {
  console.log('count()', state, action)
  switch (action.type) {
    case types.INCREMENT:
      return state + action.number
    case types.DECREMENT:
      return state - action.number
    default: // 产生初始状态值
      return state
  }
  return
}
