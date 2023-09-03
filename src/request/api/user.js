import axios from "@/request/http"
import base from "@/request/base"

const user = {
  searchByName(name) {
    return axios.get(`${base.url}/user/searchByName`, {params: {name: name}})
  },
  notification(params) {
    return axios.get(`${base.url}/user/notification`, {params: params})
  },
  readNotification(id) {
    return axios.post(`${base.url}/user/notification/${id}/read`)
  },
}

export default user
