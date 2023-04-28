/**
 * Created by mickle.jiang on 2017/11/27.
 * Edited by flora.zhang on 2022/03/22 封装一下，创建调用不同系统的api的fetch
 *  使用方式: import defFetch from './def_fetch'
            export default defFetch('costSharingHost')
 */
// 接口调用 业务相关
import config from '@/config'
import Fetch from '@/apis/fetch/index'
// import { Message } from 'view-design'
// import { setToken } from '@/utils/token'
import Bus from '_c/bus'

export default function defFetch (use_host) {
  // 正常返回
  const successResponseJson = responseJson => {
    if (responseJson.code === 11000 || responseJson.code === 401) {
      // 登录过期或未登录
      // setToken('')
      Bus.emit('logout')
      // window.location.reload(true)
      // this.$router.push({name: 'login'}) // 跳到登录页面
    }
    if (responseJson.code == -999) {
      // Message.error('系统出错，联系IT')
    }
    if (responseJson.code === 420) {
      Bus.emit('pk_limit', responseJson.data.limitInfo)
    }
    return responseJson
  }
  // 后台未处理返回 400之类的,错误统一处理
  const failResponseJson = (status, responseJson) => {
    if (status === '401' || status === 401) {
    } else if (responseJson.name === 'RepeatRequestError') {
      // console.log(responseJson.message)
      throw responseJson.message
    } else if (status === 'cancle') {
      // 跳转新的路由后 中断上个路由中的所有未完成的请求
      throw responseJson.message
    } else {
      console.log(responseJson)
      // Message.error('请求错误，请联系客服')
      throw new Error('调用接口错误')
    }
  }

  /*
  支持restful风格
  处理动态链接，参数转化，格式为
  detail:
    url: user/show/{id} # {id} 代表需要通过参数中的ID对象的值进行过滤
    method: get
*/
  const getStaticPath = (url, params) => {
    const match_name = url ? url.match(/\{.*?\}/g) : undefined
    let res
    if (match_name) {
      res = url
      for (const item of match_name) {
        res = res.replace(item, params[item.replace(/\{|\}/g, '')])
      }
      return res
    } else {
      return url
    }
  }

  // 业务默认参数
  const defaultOptions = {
    type: 'post', // 默认post请求
    use_host: use_host, // 默认请求域名name
    base_path: config['base_path']
    // use_session: true // 默认使用session
  }

  return async function (options, params) {
    let fetch = new Fetch()
    let outOptions = options
    for (let key in defaultOptions) {
      if (options[key] === undefined || options[key] === null) {
        outOptions[key] = defaultOptions[key]
      }
    }
    let url = outOptions['path'] // 接口路径
    const host = outOptions['use_host'] // 接口域名name
    url = getStaticPath(`${config[host]}/${url}`, params)
    const type = outOptions.type

    const result = await fetch.request(type, url, params, outOptions)
    console.log(result, 'result');
    if (result.status === true) {
      return successResponseJson(result.data)
    } else {
      failResponseJson(result.status, result.data)
    }
  }
}
