import ajax from "@/utils/ajax";
export default {
  //获取用户列表
  GetUserList(page, row, conditions, roleId) {
    return ajax.post("/api/Background/User/GetUserList", {
      Page: page,
      Row: row,
      Conditions: conditions,
      RoleId: roleId,
    });
  },
  //获取用户信息
  getClientInfo(clientNo) {
    return ajax.post("/api/Background/Client/GetClientinfo", {
      clientNo,
    });
  },
  //修改部分书籍信息
  updateSectionClient(clientForm) {
    return ajax.post("/api/Background/Client/UpdateSectionClient", {
      ...clientForm
    });
  },
  //修改部分书籍信息
  updateAllClient(imageFile) {
    return ajax.post("/api/Background/Client/updateAllBook", imageFile);
  },
  //删除用户
  deleteClients(clientNos) {
    return ajax.post("/api/Background/Client/DeleteClients", {
      clientNos
    });
  }
};