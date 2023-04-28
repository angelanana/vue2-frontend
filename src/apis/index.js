import userApi from '_a/user/index.js'
import defFetch from './fetch/fetch'

const NestApi = {
  ...userApi
}

// 创建host下的api fetch方法
const apiFetch = defFetch('nestHost')

// 调用当前文件配置的方法
const fetch = (name, params) => apiFetch(NestApi[name], params)

export default fetch