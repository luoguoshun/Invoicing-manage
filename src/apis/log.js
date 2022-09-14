import ajax from '@/utils/ajax';
export default {
  //获取日志列表
  getLogList(page, row, conditions, level, publicationDates) {
    return ajax.post('/api/Background/Log/GetLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Level: level,
      PublicationDates: publicationDates,
    });
  },
  //获取日志类型列表
  getLogTypeList() {
    return ajax.post('/api/Background/Log/GetLogTypeList');
  },
  //删除日志
  deleteLogs(logIds) {
    return ajax.post('/api/Background/Log/DeleteLogs', { logIds });
  },
  //导出日志
  exportLogs(logIds) {
    return ajax.post('/api/Background/Log/ExportLogs', { logIds });
  },
};
