import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/personName/pageUser`, params)
  },
  save(params) {
    return axios.post(`${base.url}/personName/save`, params)
  },
  delete(id) {
    return axios.delete(`${base.url}/personName/delete/${id}`)
  },
  
}


export default {manager}
