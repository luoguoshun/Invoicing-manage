import ajax from '../utils/ajax';
import log from './log';

export default {
    getMessageListByUserId() {
        return ajax.post('/api/Background/Message/GetMessageListByUserId')
    },
    //消息被读取
    readMessage(messageId){
        return ajax.get('/api/Background/Message/ReadMessage?messageId='+messageId+'')
    },

    //获取消息列表
    getMessageList(messagefrom)
    {
        return ajax.post('/api/Background/Message/GetMessageList',{
            ...messagefrom
        })
    },

    //删除消息列表
    deleteMessage(MessageIds)
    {
        return ajax.post('/api/Background/Message/DeleteMessage',MessageIds)
    },

    //获取消息类型
    getMessageType()
    {
        return ajax.post('/api/Background/Message/GetMessageType')
    },
    //新增消息
    addMessage(from)
    {
        return ajax.post('/api/Background/Message/AddMessage',
        {
            ...from
        })
    }
};