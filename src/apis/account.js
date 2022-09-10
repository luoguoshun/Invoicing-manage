import ajax from '../utils/ajax';

export default {
  login(account, password) {
    return ajax.post('/api/Account/AdminAccount', {
      Account: account,
      Password: password,
    });
  },
};
