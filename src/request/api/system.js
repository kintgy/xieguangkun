import axios from "@/request/http"
import base from "@/request/base"

const system = {
  announcement(params) {
    return axios.get(`${base.url}/system/announcement/current`, {params: params})
  },
  department(params) {
    return axios.get(`${base.url}/system/department/list`, {params: params})
  },
}
export default system
