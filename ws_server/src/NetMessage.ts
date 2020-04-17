
//定义消息接口
//msgMainID,msgSubID:根据id去区分是什么消息，做不同处理
//msgData:字符串类型，不同消息，填充的数据不同
export interface MSG_TYPE{
    "msgMainID":number,
    "msgSubID":number,
    "msgData":string,
    "msgLength":number,
    "msgTimeStamp":Date
}




////定义若干全局消息号

