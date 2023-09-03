import axios from "@/request/http"
import base from "@/request/base"
const manager = {
  index(params) {
    return axios.post(`${base.url}/message/pageUser `, params)
  },
  getMessage(userId) {
    return axios.get(`${base.url}/message/isMessage/${userId}  `)
  },
  getMessage2(userId) {
    return axios.get(`${base.url}/message/getCompanyName/${userId}  `)
  },
  changeStatus(params) {
    return axios.post(`${base.url}/message/saveMessageUser/`, params)
  },
  //获取首页饼图数据
  getPieChartData(params) {
    return axios.post(`${base.url}/company/getSign`, params)
  },
  getCompanyCount() {
    return axios.get(`${base.url}/company/getCount`)
  },
}

export default manager
