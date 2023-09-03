import { createApp } from 'vue'
import App from './App.vue'
import store from "@/base/store/index"
import router from "@/router"
import '@/static/css/main.css'

import zhCn from "element-plus/es/locale/lang/zh-cn"
import ElementPlus from "element-plus"
import 'element-plus/theme-chalk/index.css'
import "@/utils/dateFormatter"
import mitt from 'mitt'

const app = createApp(App)

app.use(router).use(store).use(ElementPlus, { locale: zhCn }).mount('#app')
app.config.globalProperties.emitter = mitt() // 主要是这行




/**忽略element-plus修改表头时的报错信息 */
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}
/**忽略element-plus修改表头时的报错信息 */

