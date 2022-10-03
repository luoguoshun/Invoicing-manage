import ajax from '@/utils/ajax';
export default {
  //获取系统日志列表
  getLogList(page, row, conditions, level, publicationDates) {
    return ajax.post('/api/Background/Log/GetLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Level: level,
      PublicationDates: publicationDates,
    });
  },
  //获取系统日志类型列表
  getLogTypeList() {
    return ajax.post('/api/Background/Log/GetLogTypeList');
  },
  //删除系统日志
  deleteLogs(logIds) {
    return ajax.post('/api/Background/Log/DeleteLogs', {
      logIds
    });
  },
  //导出系统日志
  exportLogs(logIds) {
    return ajax.post('/api/Background/Log/ExportLogs', {
      logIds
    });
  },
  //获取操作日志列表
  getOperateLogLogList(page, row, conditions, type, publicationDates) {
    return ajax.post('/api/Background/Log/GetOperateLogLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Type: type,
      PublicationDates: publicationDates,
    });
  },
};