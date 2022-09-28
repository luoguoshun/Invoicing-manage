import ajax from '@/utils/ajax';
export default {
    //获取审批详情
    getApprovalDetails(projectId) {
        return ajax.get('/api/Background/WorkFlow/GetApprovalDetails?projectId='+projectId+'', {
            projectId
        });
    },
};