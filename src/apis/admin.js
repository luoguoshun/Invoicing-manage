import ajax from '../utils/ajax';

export default {
  updatePwd(adminNo, oldPwd, newPwd) {
    return ajax.post('/api/Background/Admin/UpdatePwd', {
      AdminNo: adminNo,
      OldPwd: oldPwd,
      NewPwd: newPwd,
    });
  },
};
