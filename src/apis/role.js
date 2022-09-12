import ajax from '@/utils/ajax';
export default {
  //获取角色列表
  getRoleList() {
    return ajax.post('/api/Background/Role/GetRoleList');
  },
  addRole(roleId,name,descripcion) {
    return ajax.post('/api/Background/Role/AddRole', {
      roleId,
      name,
      Descripcion,
    });
  },
};
