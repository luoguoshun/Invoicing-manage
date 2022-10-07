import * as signalR from '@microsoft/signalr';
import store from '../store/index.js';
import { baseUrl } from '@/config/defaultString.js';
let hubUrl = baseUrl + '/chatHub';
//连接集线器
let connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => store.getters['token/accessToken'],//连接集线器需要认证
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Error)
  .build();
export default { connection };
