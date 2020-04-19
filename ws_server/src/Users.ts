//fileName:Users.ts
//Author:Henry
//Date:20200419
//File Description:客户端类，处理客户端的消息逻辑

import WebSocket from 'ws'
import * as NetMessageType from './NetMessageType';
import * as NetMessageID from './NetMessageID';
import * as MyUtil from './Util'
import {MongoDBManager} from './MongoDBManager'


//定义Users类
export class  Users  implements NetMessageType.USER_INFO
{       
    //============================ user data =============================
    loginSuccess:boolean;
    username ="unkonwn Name";
    password ="unkonwn Pwd";

//uname:string;////最好是在构造函数里面就设置好玩家的信息...
    constructor(public ws:WebSocket, public mongodb:MongoDBManager)
    {
        this.loginSuccess=false;
        MyUtil.outputDebugInfo("Users", "constructor","create a new users");
    };



    //============================= handle message =============================
    //接收数据
    handleIncoming(recvData: WebSocket.Data)
    {
        MyUtil.outputDebugInfo("Users", "handleIncoming","One User [handleIncoming] message");

        ///1.json 字符串转为 obj
        let objData1:NetMessageType.MSG_TYPE = JSON.parse(<string>recvData);  ///强制类型转换<string>
        console.log("c2s:" + objData1);
        ///2.judge the msgID.
        if(NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID)
        {
             ///处理玩家的 注册请求 信息
            if(NetMessageID.MESSAGE_SUB_ID.REGISTER == objData1.msgSubID)
            {
                let objData2:NetMessageType.MSG_REGISTER = JSON.parse(<string>objData1.msgData);
                if(0 != Object.keys(objData2).length)
                {                   
                    MyUtil.outputDebugInfo("Users", "handleIncoming","handle user Register request");         
                    
                    //TODO:这里必须用箭头函数写，否则this变化，找不到回调函数了
                    this.mongodb.userRegister(objData2, this.registerCallback);
                }
                else
                {
                    MyUtil.outputDebugInfo("Users","handleInComing", "invalid data..1");
                }
            }
            ///处理玩家的 登陆请求 信息
            else if(NetMessageID.MESSAGE_SUB_ID.LOGIN == objData1.msgSubID)
            {
                let objData2:NetMessageType.MSG_LOGIN = JSON.parse(<string>objData1.msgData);
                if(0 != Object.keys(objData2).length)
                {                    
                    MyUtil.outputDebugInfo("Users", "handleIncoming","handle user Login request");                
                    this.mongodb.userLogin(objData2, this.loginCallback);
                }
                else
                {
                    MyUtil.outputDebugInfo("Users","handleInComing", "invalid data..2");
                }
            }
            //处理玩家的 退出请求 信息
            else if(NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID)
            {
                let objData2:NetMessageType.MSG_LOGOUT = JSON.parse(<string>objData1.msgData);
                if(0 != Object.keys(objData2).length)
                {
                    MyUtil.outputDebugInfo("Users", "handleIncoming","handle user Logout request");
                    this.mongodb.userLogout(objData2, this.logoutCallback);
                }
                else
                {
                    MyUtil.outputDebugInfo("Users","handleInComing", "invalid data..3");
                }

            }
            else 
            {
                MyUtil.outputErrorInfo("Users", "handleIncoming","some unkonwn error..1");
            }
        }
        else
        {
            MyUtil.outputErrorInfo("Users", "handleIncoming","some unkonwn error..2");
        }
    }

    handleError(error: Error)
    {
        MyUtil.outputDebugInfo("Users", "handleError","handle error");
    }

    handleClose(code: number, reason: string)
    {
        MyUtil.outputDebugInfo("Users", "handleClose","handle close");

    }


    //============================= callback function =============================
    //code: 0 ok, 1:error
    //reason: description the error. or other . 
    registerCallback = (code: number, reason?: string)=>{
        MyUtil.outputDebugInfo("Users", "registerCallback"," register");
        if(NetMessageID.ERROR_CODE.IS_OK == code)
        {
            this.registerRsp(code,reason);
        }
        else
        {
            this.sendErrorCode(code,reason);
        }
    };

    loginCallback = (code: number, reason?: string) => {
        MyUtil.outputDebugInfo("Users", "loginCallback"," login");
        if(NetMessageID.ERROR_CODE.IS_OK == code)
        {
            this.loginRsp(code,reason);
        }
        else
        {
            this.sendErrorCode(code,reason);
        }
    };

    logoutCallback = (code: number, reason?: string)=>{
        MyUtil.outputDebugInfo("Users", "logoutCallback"," logout");
        this.logoutRsp(code, reason);
    };


    //============================= other =============================
    registerRsp(state:number, reason?: string)
    {
        MyUtil.outputDebugInfo("Users", "registerRsp"," success.");
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID =NetMessageID.MESSAGE_SUB_ID.REGISTER;

        let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{
            "code":NetMessageID.ERROR_CODE.IS_OK ,
            "des":reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);

        this.ws.send(JSON.stringify(tempSendMsg));
    }

    loginRsp(state:number, reason?: string)
    {
        MyUtil.outputDebugInfo("Users", "loginRsp"," success.");
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID =NetMessageID.MESSAGE_SUB_ID.LOGIN;

        let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{
            "code":NetMessageID.ERROR_CODE.IS_OK ,
            "des":reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);


        this.ws.send(JSON.stringify(tempSendMsg));
    }


    logoutRsp(state:number, reason?: string)
    {
        MyUtil.outputDebugInfo("Users", "logoutRsp"," success or failed.");
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID =NetMessageID.MESSAGE_SUB_ID.LOGOUT;

        let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{
            "code":NetMessageID.ERROR_CODE.IS_OK ,
            "des":reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);


        this.ws.send(JSON.stringify(tempSendMsg));
    }
    
    // send error code to client
    sendErrorCode(code:number, reason ?: string)
    {
        console.log("error code: " + code);
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.ERROR_CODE;
        tempSendMsg.msgSubID = 0;//没有子id，暂时给0
        let tempDataSend2 = <NetMessageType.MSG_ERROR>{
            "code":code,
            "des":"unknown"
        };        

        if(reason)
        {
            tempDataSend2.des = reason;
        }
        else 
        {
            tempDataSend2.des = "unknown";
        }

        tempSendMsg.msgData = JSON.stringify(tempDataSend2);

        this.ws.send(JSON.stringify(tempSendMsg));
        MyUtil.outputErrorInfo("User.ts", "sendErrorCode", JSON.stringify(tempSendMsg));
    }

}

