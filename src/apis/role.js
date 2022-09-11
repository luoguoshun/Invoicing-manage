import ajax from '@/utils/ajax';
export default {
  //获取角色列表
  getRoleList() {
    return ajax.post('/api/Background/Role/GetRoleList');
  },
}