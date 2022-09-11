import axios from 'axios';
import store from '../store';
import funs from './funs';
import encrypt from './encrypt';
import { Message } from 'element-ui';
import { createThrottle } from './throttle';
import router from '@/router';

const baseurl = 'http://127.0.0.1:36559';
//创建axios实例
const ajax = new axios.create({
  withCredentials: false, //跨域请求是否允许携带cookie资源凭证
  baseURL: baseurl,
  time: 10000, //请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});
const unauthorizedHandler = createThrottle(() => {
  const nowRouteName = router.history.current.name;
  console.log(nowRouteName);
  if (nowRouteName != 'login') {
    Message.warning('登录失效，请重新登录!');
    router.push({
      name: "login",
      query: {
        redirectUrl: router.history.current.fullPath,
      },
    });
  }
}, 1000);
const isEncrypt = (() => {
  if (process.env.NODE_ENV == 'development') {
    return false;
  } else {
    return true;
  }
})();
//请求拦截器
ajax.interceptors.request.use(
  (config) => {
    const access_token = store.getters['token/access_token'];
    if (access_token != null) {
      config.headers['Authorization'] = 'Bearer ' + access_token;
    }
    if (isEncrypt) {
      config.data = {
        ciphertext: encrypt.EncryptData(config.data),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 响应拦截器
ajax.interceptors.response.use(
  (response) => {
    // 后端返回字符串表示需要解密操作
    if (isEncrypt && typeof response.data.data == 'string' && funs.strTrim(response.data.data) !== '') {
      let data = encrypt.DecryptData(response.data.data);
      try {
        response.data.data = JSON.parse(data);
      } catch (e) {
        response.data.data = {};
      }
    } else {
      if (funs.isUndef(response.data.data)) {
        response.data.data = [];
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // 401未登录
      if (error.response.status === 401) {
        unauthorizedHandler();
      }
      //403没权限
      else if (error.response.status === 403) {
        Message.warning('没有权限访问');
        // store.dispatch("user/logout");
      } else if (error.response.status === 400) {
        Message.warning('参数错误');
      }
    }
    return Promise.reject(error.response);
  },
);
export default ajax;
