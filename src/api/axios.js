/*
  封装 **axios** (能发 `ajax` 请求的函数)，向外暴露的本质是 `axios`
    1. 解决 **POST** 请求携带参数的问题：默认是 `json`，需要转换成 `urlencoded` 格式
    2. 使异步请求成功的数据不再是 `response`，而是 `response.data` 的值（过滤数据）
    3. 统一处理所有请求的异常错误
*/

import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'

// 添加请求拦截器：在真正发请求之前执行
// 让 **POST** 请求的请求体格式为 `urlencodeed` 格式（a=1&b=2）
// a=1&b=2
axios.interceptors.request.use(function (config) {
  // console.log('请求拦截器')
  // console.log(config)

  // 得到请求方式和请求体数据
  const { method, data } = config
  // console.log(typeof data) // object

  // 处理 post 请求，将 data 对象转换成 query 参数格式字符串
  if (method.toLowerCase() === 'post' && typeof data === 'object') {
    config.data = qs.stringify(data)
  }

  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

/*
  添加响应拦截器：在请求返回之后，且在我们指定的请求响应回调函数之前执行
    + 功能 1：让请求成功的结果不再是 `response`，而是其中的 `data` 数据
    + 功能 2：统一处理所有请求的异常错误
*/
axios.interceptors.response.use(function (response) {
  // console.log('响应拦截器')
  // console.log(response)

  // Do something with response data
  // 返回的结果就会交给我们指定的请求响应的回调函数
  return response.data;
}, function (error) { // 统一处理请求异常
  message.error('请求出错' + error.message)
  // Do something with response error
  // return Promise.reject(error);

  // 返回一个 pending 状态的 promise，中断 promise 链
  return new Promise(() => {})
});

export default axios