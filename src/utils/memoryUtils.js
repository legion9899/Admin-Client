import storageUtils from "./storageUtils"

export default {
  user: storageUtils.getUser(), // 用来存储登录用户的信息，初始值为 local 中读取的 user
}