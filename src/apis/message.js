import ajax from '../utils/ajax';

export default {
    getMessageListByUserId() {
        return ajax.post('/api/Background/Message/GetMessageListByUserId')
    },
    //消息被读取
    readMessage(messageId){
        return ajax.get('/api/Background/Message/ReadMessage?messageId='+messageId+'')
    },
};