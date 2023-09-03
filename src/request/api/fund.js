import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/jijin/pageUser `, params)
  },
  detail(id) {
    return axios.get(`${base.url}/jijin/getById/${id}`, { id: id })
  },
  save(params) {
    return axios.post(`${base.url}/jijin/save`, params)
  },
  delete(id) {
    return axios.delete(`${base.url}/jijin/delete/${id}`)
  },

  getyitou(id) {
    return axios.get(`${base.url}/touhou/getByJiJinId/${id}`)
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
