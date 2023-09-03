import axios from "@/request/http";
import base from "@/request/base";
const manager = {
  getTableData(params) {
    return axios.post(`${base.url}/sign/pageUser`, params);
  },
  save(params) {
    return axios.post(`${base.url}/sign/save`, params);
  },
  getDetail(id) {
    return axios.get(`${base.url}/sign/getById/${id}`);
  },
  delete(id) {
    return axios.delete(`${base.url}/sign/delete/${id}`);
  },
  up(id) {
    return axios.get(`${base.url}/sign/moveUp/${id}`);
  },
  down(id) {
    return axios.get(`${base.url}/sign/moveDown/${id}`);
  },
};

export default { manager };
