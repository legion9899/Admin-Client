/**
 * 包含 N 个用于创建 action 对象的工厂函数
 * 
 * - 如何创建对象
 *    + 工厂函数：这个函数每次调用都返回一个新的对象，就把它称为工厂函数（JS 高级）
 */

import * as types from './action-types'

/* 创建增加的 action */
export const increment = (number) => ({
  type: types.INCREMENT,
  number
})

/* 创建减少的 action */
export const decrement = (number) => ({
  type: types.DECREMENT,
  number
})
