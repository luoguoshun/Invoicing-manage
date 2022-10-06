import Vue from 'vue';
import App from './App.vue';
import apis from './apis/index';
import router from './router';
import store from './store';
import elementUI from 'element-ui';
import signalR from './utils/signalR.js';
import * as timeFormat from './utils/timeFormat.js';
import 'element-ui/lib/theme-chalk/index.css';
import 'default-passive-events'
// import * from CommonFun
Vue.use(elementUI);
Object.defineProperty(Vue.prototype, '$api', {
  value: apis,
});
Object.defineProperty(Vue.prototype, '$signalR', {
  value: signalR,
});
Object.defineProperty(Vue.prototype, '$timeFormat', {
  value: timeFormat,
});
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');