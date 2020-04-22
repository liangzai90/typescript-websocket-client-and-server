//fileName:NetMessageID.ts
//Author:Henry
//Date:20200419
//File Description:定义服务器和客户端交互的消息号


/** 主消息号.msgMainID,msgSubID:根据id去区分是什么消息，做不同处理 */
export enum MESSAGE_MAIN_ID{
    /**专门处理服务器发给客户端的错误消息 */
    ERROR_CODE, 
    /**处理登陆、注册请求 */
    MAIN_ID_LOGIN_REGISTER,
};

/** 次消息号 */
export enum MESSAGE_SUB_ID{
    /**用户注册 子消息号 */
    REGISTER = 1,
    /**用户登陆 子消息号 */
    LOGIN,
    /**用户退出 子消息号 */
    LOGOUT,
    /**客户端给服务器发送一个Hello消息 */
    SAY_HELLO,
}

/** 错误码 */
export enum ERROR_CODE{
    /**正常 */
    IS_OK,
    /**注册失败 错误码 */
    REGISTER_FAILED,
    /**登陆失败 错误码 */
    LOGIN_FAILED,
    /**退出失败 错误码 */
    LOGOUT_FAILED
}


