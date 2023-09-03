import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/user/pageUser`, params)
  },
  save(params) {
    return axios.post(`${base.url}/user/save`, params)
  },
  delete(id) {
    return axios.post(`${base.url}/user/delete/${id}`)
  },
}

const role = {
  index(params) {
    return axios.post(`${base.url}/role/pageUser`, params)
  },
  save(params) {
    return axios.post(`${base.url}/role/save`, params)
  },
  delete(id) {
    return axios.delete(`${base.url}/role/delete/${id}`)
  }
}

export default {manager, role}
