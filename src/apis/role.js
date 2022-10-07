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
  //通过Excel文件导入数据
  importRolesByExcel(excelFile) {
    console.log(excelFile);
    return ajax.post('/api/Background/Role/ImportRolesByExcel',excelFile);
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
  },
  // 获取角色权限列表
  getAllPermissionsByRoleId(roleId) {
    return ajax.post("/api/Background/Role/GetAllPermissionsByRoleId", {
      roleId
    });
  },
  //分配权限
  assignPermissions(roleId, routerIds) {
    console.log(roleId);
    console.log(routerIds);
    return ajax.post("/api/Background/Role/AssignPermissions", {
      roleId,
      routerIds
    });
  }
};