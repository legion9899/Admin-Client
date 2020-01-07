import storageUtils from "./storageUtils"

// 第一次读取信息并保存为 user 变量，再次就无需每次都从 localStorage 中读取了
const user = storageUtils.getUser()

export default {
  user, // 用来存储登录用户的信息，初始值为 local 中读取的 user
  product: {}, // 需要查看的商品对象
}