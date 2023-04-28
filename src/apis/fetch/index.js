/**
 * 封装接口请求，初始化参数
 */
// store为实例化生成的
import sto from '@/store'
import config from '@/config/index'
import _axios from '@/utils/http'
import axios from 'axios'
// import { getToken } from '@/utils/token.js'
// let crypto = require('crypto')
console.log(_axios(), '_axios');
console.log(axios, 'axios');
class Fetch {
  // 处理传到后台参数(通用)
  dealParams (params, outOptions = {}) {
    let param = params
    param['visit_info'] = {
      ver: config.version, // 前端版本
      lan: sto.get('i18n', 'zh'), // 中英文
      from_genre: 'reader'
    }
    return param
  }

  getHeaders (outOptions = {}) {
    let _headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Accept': '*'
    }
    // if (!outOptions.without_session) {
    //   _headers['Authorization'] = getToken()
    // }
    if (outOptions.headers) {
      _headers = Object.assign(_headers, outOptions.headers)
    }
    return _headers
  }

  // 发起请求
  async request (type, url, params, outOptions = {}) {
    let _this = this
    // _this.mock() // 使用mock
    const param = params // this.dealParams(params, outOptions)
    try {
      let requestH = {
        method: type,
        url: url,
        canRepeat: outOptions.canRepeat || false, // 处理重复请求
        cancelToken: axios.CancelToken.source().token, // 取消请求
        headers: this.getHeaders(outOptions)
      }
      if (params && params.timeout) {
        requestH = Object.assign(requestH, { timeout: params.timeout })
      } else if (outOptions && outOptions.timeout) {
        requestH = Object.assign(requestH, { timeout: outOptions.timeout })
      }
      // post和get的传参不一样
      if (type === 'post' || type === 'put') {
        requestH.data = param
      } else {
        requestH.params = param
      }
      // axios.axios.defaults.withCredentials = true
      console.log(requestH, 'requestH');
      console.log(_axios, '_axios=====');
      console.log(_axios(requestH), '_axios(requestH)');
      let res = await _axios(requestH)
      console.log(res, 'res');
      return _this.dealSuccessResponse(res)
    } catch (e) {
      return _this.dealFailResponse(e)
    }
  }

  // 使用mock
  mock () {
    // require('@/test/mock/login.js')
    // require('@/test/mock/event.js')
  }

  // 使用缓存
  storage () {
    // TODO
  }

  // 处理返回的正常请求
  dealSuccessResponse (res) {
    if (res === undefined || res === null) {
      return { status: 405, data: error }
    } else {
      let data = res.data
      return { status: true, data: data }
    }
  }

  // 处理异常返回
  dealFailResponse (error) {
    console.log(error)
    if (error.response) {
      return { status: error.response.status, data: error.response.data }
    } else {
      return { status: 405, data: error }
    }
  }
}

export default Fetch
