//fileName:NetMessageID.ts
//Author:Henry
//Date:20200419
//File Description:定义服务器和客户端交互的消息号


///主消息号.msgMainID,msgSubID:根据id去区分是什么消息，做不同处理
export enum MESSAGE_MAIN_ID
{
    ERROR_CODE,
    MAIN_ID_LOGIN_REGISTER,
};

//次消息号
export enum MESSAGE_SUB_ID
{
    REGISTER = 1,
    LOGIN,
    LOGOUT
}

//错误码
export enum ERROR_CODE{
    IS_OK,
    REGISTER_FAILED,
    LOGIN_FAILED,
    LOGOUT_FAILED
}



