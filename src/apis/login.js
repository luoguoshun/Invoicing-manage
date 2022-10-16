import ajax from '../utils/ajax';

export default {
  login(account, password) {
    return ajax.post('/api/Login/Login', {
      Account: account,
      Password: password,
    });
  },
};
