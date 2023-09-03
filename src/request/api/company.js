import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/company/pageUser`, params)
  },
  detail(id) {
    return axios.get(`${base.url}/company/getById/${id}`, { id: id })
  },
  save(params) {
    return axios.post(`${base.url}/company/save`, params)
  },
  delete(id) {
    return axios.delete(`${base.url}/company/delete/${id}`)
  },
  sortNum(){
    return axios.get(`${base.url}/company/getSort`)
  },
  openUrl(params) {
    return axios({
      method: 'get',
      url: `${base.url}/company/download/${params.fileName}`,
      responseType: 'blob',
    })
  },
  export(data){
    return axios({
      method: 'post',
      data:data,
      url: `${base.url}/company/export`,
      responseType: 'blob',
    })
  }
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

const settings = {
  DataList() {
    return axios.get(`${base.url}/headConfig/getByType/1`)
  },
  SaveSettings(data) {
    return axios.post(`${base.url}/headConfig/save`,data)
  },
}

export default { manager, role ,settings}
