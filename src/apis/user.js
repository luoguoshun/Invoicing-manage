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
    return ajax.post("/api/Background/User/GetClientinfo", {
      clientNo,
    });
  },
  //修改部分用户信息
  updateUser(userForm) {
    return ajax.post("/api/Background/User/UpdateUser", {
      ...userForm
    });
  },
  //上传用户头像
  UploadUserHeadImg(imageFile) {
    return ajax.post("/api/Background/User/UploadUserHeadImg", imageFile);
  },

  updateUserState(userId, state) {
    return ajax.post("/api/Background/User/UpdateUserState", {
      userId,
      state
    });
  },
  //删除用户
  deleteUsersById(userIds) {
    return ajax.post("/api/Background/User/DeleteUsersById", 
      userIds
    );
  }
};