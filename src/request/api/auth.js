import axios from "@/request/http"
import base from "@/request/base"

const auth = {
  login(params) {
    return axios.post(`${base.url}/user/login`, params)
  },
  getCurrentUser(token) {
    return axios.get(`${base.url}/auth/user/current`, {headers: {Authorization: token}})
  }
}

export default auth
