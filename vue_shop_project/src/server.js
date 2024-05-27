import axios from 'axios'

// 导入Nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const api = axios.create({
  //  baseURL : 'http://127.0.0.1:8888/api/private/v1/',
   baseURL : 'http://192.168.1.11:8888/api/private/v1/',
  //  baseURL : '/api',
   timeout:50000,
})


api.interceptors.request.use((config) => {
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
// 隐藏进度条
api.interceptors.response.use(config =>{
  NProgress.done()
  return config
})

export default api 