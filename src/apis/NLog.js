import ajax from '@/utils/ajax';
export default {
  //获取日志列表
  getNLogList(page, row, conditions, level, publicationDates) {
    return ajax.post('/api/Background/NLog/GetNLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Level: level,
      PublicationDates: publicationDates,
    });
  },
  //获取日志类型列表
  getNLogTypeList() {
    return ajax.post('/api/Background/NLog/GetNLogTypeList');
  },
  //删除日志
  deleteLogs(logIds) {
    return ajax.post('/api/Background/NLog/DeleteLogs', { logIds });
  },
  //导出日志
  exportLogs(logIds) {
    return ajax.post('/api/Background/NLog/ExportLogs', { logIds });
  },
};
