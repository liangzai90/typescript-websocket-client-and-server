//fileName:NetMessageType.ts
//Author:Henry
//Date:20200419
//File Description:定义和客户端交互的消息结构

/**服务器和客户端通信的消息结构体 */
export interface MSG_TYPE{
    /**主消息号 */
    msgMainID:number,
    /**次消息号 */
    msgSubID:number,
/** msgData:字符串类型，不同消息，填充的数据不同 */
    msgData:string,
    /**备用字段，暂未使用 */
    msgLength:number,
    /**时间戳 */
    msgTimeStamp:Date
};


/**regis msg type */
export interface MSG_REGISTER{
    /**用户名 */
    username:string,
    /**用户密码 */
    password:string
};

/** login msg type */
export interface MSG_LOGIN{
    /**用户名 */
    username:string,
    /**用户密码 */
    password:string
};

/** logout msg type */
export interface MSG_LOGOUT{
    /**用户名 */
    username:string,
    /**用户密码 */
    password:number
};


/** 用户信息 结构体*/
export interface USER_INFO{
    /**用户名 */
    username:string,
    /**用户密码 */
    password:string,
    /**用户 id */
    userid:number
};

/** 用户登陆的url参数 结构体*/
export interface USER_LOGIN_PARMA{
    /**用户名 */
    username:string,
    /**用户密码 */
    password:string
    /**用户行为 */
    act:number
};



/**MongoDB连接地址信息 结构体 */
export interface MONGODB_INFO{
    /**Mongo 数据库IP地址 */
    url:string,
    /**连接的哪个数据库 */
    dbName:string,
};

/**WebSocket连接地址信息 结构体 */
export interface WEBSOCKET_INFO{
    /**websocket 服务器地址*/
    url:string,
    /**监听端口 */
    port:number
}



//========================== s2c msg type

/** error msg type */
export interface MSG_ERROR{
    /**错误码 */
    code:number,
    /**错误信息描述 */
    des:string
};

/** client say hello to server */
export interface MSG_SAY_HELLO{
    username:string,
    des:string
};

/**玩家注册 信息表 */
export interface TABLE_USER_REGISTER{
    /**名称 */
    username:string,
    /**玩家id */
    userid:number,
    /**密码 */
    password:string,
    /**日期 */
    timestamp:Date
}

/**玩家退出游戏 信息表 */
export interface TABLE_USER_LOGOUT{
    /**名称 */
    username:string,
    /**玩家id */
    userid:number,
    /**密码 */
    des:string,
    /**日期 */
    timestamp:Date
}


/** S2C:login,register,logout msg type */
export interface MSG_S2C_RSP_1{
    /**玩家名称 */
    username:string,
    /**玩家id */
    userid:number,//TODO:待填充
    /**服务器返回给客户端的 错误码 */
    code:number,
    /**服务器返回给客户端的 描述信息 */
    des:string
};

