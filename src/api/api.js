import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    //发生网络错误后会走到这里
    return err
  }
)

// fly.config.baseURL = 'http://true.ihuqu.com/' // 测试地址
fly.config.baseURL = 'https://www.5qianqian.com/' // 线上地址
fly.config.headers['content-type'] = 'application/x-www-form-urlencoded' // 请求头content-type配置

// 登录
export const login = function(code) {
  const url = `index.php?m=phiz&c=api&a=mpLogin`
  const data = Object.assign({}, {
    code: code
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 首页列表
export const getList = function(page, cid = null, auth) {
  const url = `index.php?m=phiz&c=index&a=lists`
  const data = Object.assign({}, {
    page: page,
    cid: cid,
    auth: auth
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 搜索日志
export const searchLog = function(auth) {
  const url = `index.php?m=phiz&c=index&a=search_log`
  const data = Object.assign({}, {
    auth: auth
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 搜索
export const search = function(auth, page = 0, query) {
  const url = `index.php?m=phiz&c=index&a=search`
  const data = Object.assign({}, {
    auth: auth,
    page: page,
    name: query
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 相关推荐
export const recommend = function(auth, id) {
  const url = `index.php?m=phiz&c=index&a=correlation`
  const data = Object.assign({}, {
    auth: auth,
    id: id
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 收藏 | 取消收藏
export const favorite = function(auth, id, status) {
  const url = `index.php?m=phiz&c=index&a=favorite`
  const data = Object.assign({}, {
    auth: auth,
    id: id,
    status: status
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}

// 收藏列表
export const favoriteList = function(auth) {
  const url = `index.php?m=phiz&c=index&a=favorite_lists`
  const data = Object.assign({}, {
    auth: auth
  })
  return fly.get(url, data).then((res) => {
    return Promise.resolve(res)
  })
}


