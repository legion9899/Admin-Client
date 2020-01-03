/*
  包含应用中所有请求接口的函数：接口请求函数
  函数的返回值都是 Promise 对象
*/

// import qs from 'qs'
import axios from './axios'

// 请求登录
// data 是对象，默认使用 json 格式的请求体携带参数数据
export const reqLogin = (username, password) => axios.post('/login', { username, password })

// const name = 'admin'
// const pwd = '123456'

// // 将实参数据赋值给形参变量
// reqLogin(name, pwd)
// .then((data) => {
//   console.log('请求成功了', data)
// })
