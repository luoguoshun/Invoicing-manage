import axios from 'axios';
import store from '@/store';
import funs from './funs';
import encrypt from './encrypt';
import {
  Message
} from 'element-ui';
import {
  createThrottle
} from './throttle';
import router from '@/router';
import {
  baseUrl
} from '@/config/defaultString.js'

//创建axios实例
const ajax = new axios.create({
  withCredentials: false, //跨域请求是否允许携带cookie资源凭证
  baseURL: baseUrl,
  time: 10000, //请求超时时间
  headers: {
    // 'Content-Type': 'application/json;charset=UTF-8'
  },
});
const unauthorizedHandler = createThrottle(() => {
  const nowRouteName = router.history.current.name;
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
//判断是否是开发环境，
//如果是将对传输的参数进行加密操作,返回来的数据进行解密操作
const isEncrypt = (() => {
  return process.env.NODE_ENV == 'development' ? false : true
})();
//请求拦截器
ajax.interceptors.request.use(
  (config) => {
    const access_token = store.getters['token/accessToken'];
    if (access_token != null) {
      config.headers['Authorization'] = 'Bearer ' + access_token;
    }
    //生产环境加密操作
    if (isEncrypt) {
      // config.data = {
      //   ciphertext: encrypt.EncryptData(config.data),
      // };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
//响应拦截器
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
      } else if (error.response.status === 403) {
        Message.warning('没有权限访问');
      } else if (error.response.status === 404) {
        Message.warning('API Not Found');
      } else if (error.response.status === 400) {
        Message.warning('请求参数错误');
      } else if (error.response.status === 405) {
        Message.warning('Method Not Allowed');
      } else if (error.response.status === 415) {
        Message.warning('不支持的媒体类型');
      } else if (error.response.status === 408) {
        Message.warning('请求超时。服务器等待客户端发送的请求时间过长，超时。');
      } else if (error.response.status === 500) {
        Message.warning('服务器错误');
      } else if (error.response.status === 503) {
        Message.warning('服务器没有准备好处理请求。由于超载或系统维护，服务器暂时的无法处理客户端的请求。');
      }
    }
    return Promise.reject(error.response);
  },
);
export default ajax;