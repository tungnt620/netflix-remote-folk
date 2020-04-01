import axios from 'axios'
import { LOCALSTORAGE_PREFIX } from './shared/constants'

const timeout = 86400000

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: timeout,
  withCredentials: true,
})

instance.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem(`${LOCALSTORAGE_PREFIX}Token`)
    if (token) config.headers.Authorization = `JWT ${token}`
    return config
  },
  function(error) {
    return Promise.reject(error)
  },
)

export default instance
