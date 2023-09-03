import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/touhou/pageUser `, params)
  },
  detail(id) {
    return axios.get(`${base.url}/touhou/getById/${id}`, { id: id })
  },
  save(params) {
    return axios.post(`${base.url}/touhou/save`, params)
  },
  delete(id) {
    return axios.delete(`${base.url}/touhou/delete/${id}`)
  },
  nameList(sign){
    return axios.post(`${base.url}/company/pageUser`, { sign: sign,page:1,pageSize:10 })
  },

  openUrl(params) {
    return axios({
      method: 'get',
      url: `${base.url}/company/download/${params.fileName}`,
      responseType: 'blob',
    })
  },

}

export default { manager}
