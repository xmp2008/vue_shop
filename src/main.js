import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid'
// import i18n from './lang' // internationalization
axios.defaults.baseURL = "http://localhost:8081";
axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component('tree-table', TreeTable)
// Vue.use(Element, {
//     i18n: (key, value) => i18n.t(key, value)
// })
new Vue({
    router,
    // i18n,
    render: h => h(App)
}).$mount("#app");
