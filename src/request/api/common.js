import axios from "@/request/http"
import base from "@/request/base"
import QS from "querystring";

const common = {
  download(target, title, fields, params) {
    return axios.post(
        `${base.url}/download/file`,
        QS.stringify({target: target, title: title, fields: fields}),
        {params: Object.assign({download: true,}, params)}
    );
  },
}

export default common
