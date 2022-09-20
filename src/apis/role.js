import ajax from '@/utils/ajax';
export default {
  //获取角色列表
  getRoleList() {
    return ajax.post('/api/Background/Role/GetRoleList');
  },

  //添加角色
  addRole(RoleForm) {
    return ajax.post('/api/Background/Role/AddRole', {
      ...RoleForm,
    });
  },

  //修改部分角色信息
  updateRole(RoleForm) {
    return ajax.post('/api/Background/Role/UpdateRole', {
      ...RoleForm,
    });
  },

  //删除角色
  deleteRoleIdById(roleIds) {
    return ajax.post("/api/Background/Role/DeleteRolesById", 
    roleIds
    );
  }
};
