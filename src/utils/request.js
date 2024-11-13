import { useUserStore } from '@/stores/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const baseURL = 'http://localhost:8081'
const instance = axios.create({
  // 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    //处理业务失败
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    // 摘取核心响应数据
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理401错误
    // 错误的特殊情况401权限不足或token过期 ，拦截到登录
    if (err.response?.status) ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
    // 处理401错误
  }
)
export default instance
export { baseURL }
