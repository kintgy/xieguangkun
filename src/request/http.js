/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import router from "@/router";
import store from "@/base/store";
import { ElMessage } from "element-plus";

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  store.dispatch("EDIT_USERINFO", undefined);
  localStorage.removeItem("token");
  ElMessage.warning({
    message: "服务器用户信息认证失败，请重新登录",
    duration: 1000,
    onClose() {
      if (
        ["/login", "/login/callback", "/login/refresh"].indexOf(
          router.currentRoute.value.path
        ) >= 0
      )
        return router.push({ name: "Login" });
      router.push({
        name: "Login",
        query: { goto: router.currentRoute.value.path },
      });
    },
  });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    case 401001:
      toLogin();
      break;
    case 401002:
      toLogin();
      break;
    case 404:
      ElMessage.error("请求的资源不存在" + msg);
      break;
    case -1:
      ElMessage.error(msg);
      break;
    default:
      ElMessage.error(msg ? msg : "服务器异常，请刷新页面重试");
  }
};

// 创建axios实例
let instance = axios.create({ timeout: 1000 * 60 });
// 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers.post["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Accept"] = "*/*"

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config) => {
    const token = !store.getters.tokenInfo ? null : store.getters.tokenInfo;
    if (token) {
      config.headers.Authorization = token.access_token;
    }
    store.dispatch("EDIT_LOADING", true);

    return config;
  },
  (error) => Promise.error(error)
);

instance.interceptors.response.use(
  (res) => {
    store.dispatch("EDIT_LOADING", false);

    if (!res.data.isSuccess) {
      if (res.config.responseType === "blob") {
        // 下载接口
        return res
      } else {
        errorHandle(res.data.code, res.data.description);
        return Promise.reject(res);
      }
    }

    if (undefined === res.data.data.page) {
      return Promise.resolve(res.data.data.content ? res.data.data.content : res.data.data)
    }

    return Promise.resolve({
      page: {
        pageSize: res.data.data.page.size ? res.data.data.page.size : 20,
        page: res.data.data.page.page ? res.data.data.page.page : 1,
        total: res.data.data.page.totalElements ? res.data.data.page.totalElements : 28
      },
      data: res.data.data.content
    });
  },
  (error) => {
    store.dispatch("EDIT_LOADING", false);
    const { response } = error;
    if (response) {
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
        return Promise.reject(error);
      }
      if (!window.navigator.onLine) {
        store.commit("changeNetwork", false);
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default instance;
