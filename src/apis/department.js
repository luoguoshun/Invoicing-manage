import ajax from "../utils/ajax"

export default{

  //获取部门列表
  GetDepartmentList() {
    return ajax.post('/api/Background/Department/GetDepartmentList');
  },

   //修改部门信息
   UpdateDepartment(DepartmentFrom) {
    return ajax.post('/api/Background/Department/UpdateDepartment', {
      ...DepartmentFrom,
    });
  },

  //添加部门
  AddDepartment(DepartmentFrom) {
    return ajax.post('/api/Background/Department/AddDepartment', {
      ...DepartmentFrom,
    });
  },
};