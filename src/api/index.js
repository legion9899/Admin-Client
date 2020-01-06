/*
  包含应用中所有请求接口的函数：接口请求函数
  函数的返回值都是 Promise 对象
*/

import jsonp from 'jsonp'
import axios from './axios' // 不能发 jsonp 请求
import { message } from 'antd'

// 请求登录
// data 是对象，默认使用 json 格式的请求体携带参数数据
export const reqLogin = (username, password) => axios.post('/login', { username, password })

// 发送 jsonp 请求得到天气信息
export const reqWeather = (city) => {
  // 执行器函数：内部去执行异步任务
  // 成功了调用 resolve()，失败了步调用 reject()，直接提示错误信息
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${ city }&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (error, data) => {
      if (!error && data.error === 0) { // 成功的
        const { dayPictureUrl, weather }  = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else { // 失败的
        message.error('获取天气信息失败')
      }
    })
  })
}

// const persons/personList/personArr = [{}, {}]

// 获取分类列表
export const reqCategorys = () => axios.get('/manage/category/list')

// 添加分类
export const reqAddCategory = (categoryName) => axios.post('/manage/category/add', { categoryName })

// 修改分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => axios.post('/manage/category/update', { categoryId, categoryName })

// 根据分类 ID 获取分类名称
export const reqCategory = (categoryId) => axios('/manage/category/info', {
  params: {
    categoryId
  }
})

// 获取商品分类列表
export const reqProducts = (pageNum, pageSize) => axios('/manage/product/list', {
  params: { // 包含是所有 query 参数的对象
    pageNum,
    pageSize
  }
})

// 根据 name/desc 搜索产品分页列表
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchType, // 它的值只能是 `productName` / `productDesc` 中的一个
  searchName
}) => axios('/manage/product/search', {
  // method: 'GET',
  params: {
    pageNum, // 页码
    pageSize, // 每页条目数
    // **属性名有好几种情况，要加中括号**
    // 根据 searchType 的值作为参数名
    [searchType]: searchName, // 根据商品名称 / 商品描述搜索
  }
})

// 对商品进行上架 / 下架处理
/* axios.post('/manage/product/updateStatus', { productId, status } */
export const reqUpdateStatus = (productId, status) => axios('/manage/product/updateStatus', {
  method: 'POST',
  data: {
    productId,
    status
  },
})
