//fileName:NetMessageType.ts
//Author:Henry
//Date:20200419
//File Description:定义和客户端交互的消息结构

//msgData:字符串类型，不同消息，填充的数据不同
export interface MSG_TYPE{
    "msgMainID":number,
    "msgSubID":number,
    "msgData":string,
    "msgLength":number,
    "msgTimeStamp":Date
};


//regis msg type
export interface MSG_REGISTER
{
    "username":string,
    "password":string
};

//login msg type
export interface MSG_LOGIN
{
    "username":string,
    "password":string
};

//logout msg type
export interface MSG_LOGOUT
{
    "username":string,
    "password":string
};


//用户信息
export interface USER_INFO{
    "username":string,
    "password":string
};

export interface MONGODB_INFO{
    "url":string,
    "dbName":string,
};

export interface WEBSOCKET_INFO{
    "url":string,
    "port":number
}



//========================== s2c msg type

//error msg type
export interface MSG_ERROR
{
    "code":number,
    "des":string
};

//S2C:login,register,logout msg type
export interface MSG_S2C_RSP_1
{
    "code":number,
    "des":string
};






