/**
 * http配置
 */
import axios from 'axios'
const defaultConfig = {
  // 请求超时时间
  timeout: 60 * 1000,
  heards: {
    get: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数(第三个参数即config)
      // 例如：
      //     services.post(`${base.lkBaseURL}/uploads/singleFileUpload`, file, {
      //       headers: { "Content-Type": "multipart/form-data" }
      //     });
      'Content-Type': 'application/json;charset=utf-8'
    }
  }
}
const _axios = axios.create(defaultConfig)

// http请求拦截器
_axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

export default _axios
