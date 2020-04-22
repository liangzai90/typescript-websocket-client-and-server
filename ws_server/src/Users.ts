//fileName:Users.ts
//Author:Henry
//Date:20200419
//File Description:客户端类，处理客户端的消息逻辑

import WebSocket from 'ws'
import * as NetMessageType from './NetMessageType';
import * as NetMessageID from './NetMessageID';
import * as MyUtil from './Util'
import {MongoDBManager} from './MongoDBManager'


/** 定义Users类 */
export class  Users{       
    //============================ user data =============================
    private loginSuccess:boolean;
    /**保存玩家信息 */
    private userInfo:NetMessageType.MSG_S2C_RSP_1 = <NetMessageType.MSG_S2C_RSP_1>{};

    /**返回玩家信息 */
    public getUserInfo(){
        return this.userInfo;
    }
    constructor(public ws:WebSocket, userInfo: NetMessageType.MSG_S2C_RSP_1){
        this.userInfo.username = userInfo.username;
        this.userInfo.userid = userInfo.userid;
        this.userInfo.code = userInfo.code;
        this.userInfo.des = userInfo.des;
        this.loginSuccess=true;
        MyUtil.outputDebugInfo("Users", "constructor", `create a new users: username:${this.userInfo.username},userID:${this.userInfo.userid}`);
        this.init();
    };

    /** 初始化Users类，并绑定消息路由 */
    init() {
         this.ws.on('message', this.handleIncoming);       
    }


    //============================= handle message =============================
    /** 消息入口，服务器 接收并处理 客户端发来的消息.根据主消息号、子消息号去判断具体消息   */
    handleIncoming = (recvData: WebSocket.Data) => {
        MyUtil.outputDebugInfo("Users", "handleIncoming","One User [handleIncoming] message");

        ///1.json 字符串转为 obj
        let objData1:NetMessageType.MSG_TYPE = JSON.parse(<string>recvData);  ///强制类型转换<string>
        console.log("c2s:" + objData1);
        
        //client say hello to server. server say hello to client.
        if(NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID){
            if(NetMessageID.MESSAGE_SUB_ID.SAY_HELLO == objData1.msgSubID){
                this.handleClientSayHello(<string>objData1.msgData);
            }
            else if(NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID)
            {
                this.handleClientLogout(<string>objData1.msgData);
            }
        }
    }

    /**处理 socket的error */
    handleError = (error: Error) => {
        MyUtil.outputDebugInfo("Users", "handleError","handle error");
    }

    /**处理 客户端断开连接 */
    handleClose(code: number, reason: string) {
        MyUtil.outputDebugInfo("Users", "handleClose","handle close");

    }


    //========================= S2C Message ================================
    /**处理客户端的 hello 消息 */
    handleClientSayHello(msgStr:string){

        /**服务器解析客户的消息内容 */
        let recvData1 = <NetMessageType.MSG_SAY_HELLO>{};
        let objData1 =  JSON.parse(msgStr);
        recvData1.username =objData1.username;
        recvData1.des =objData1.des;

        MyUtil.outputDebugInfo("Users", "handleClientSayHello",`Server receive client [${recvData1.username}] ,message:${recvData1.des}.`);
        MyUtil.outputDebugInfo("Users", "handleClientSayHello","Server say Hello to client too...");

        /**发一条测试消息给客户端 */
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.SAY_HELLO;

        let tempDataSend2 = <NetMessageType.MSG_SAY_HELLO>{
            username:"I am Server.",
            des:"Server say hello to client."
        };        
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
    }

    /**处理客户端的退出消息 */
    async handleClientLogout(msgStr:string){

        /**服务器解析客户的消息内容 */
        let recvData1 = <NetMessageType.MSG_S2C_RSP_1>{};
        let objData1 =  JSON.parse(msgStr);
        // userInfo
        recvData1.username =this.userInfo.username;
        recvData1.userid =this.userInfo.userid;
        recvData1.des =objData1.des;

        MyUtil.outputDebugInfo("Users", "handleClientLogout",`Server receive client [${recvData1.username}] ,message:${recvData1.des}.`);
        MyUtil.outputDebugInfo("Users", "handleClientLogout","client logout");

        
        let rerValue = await MongoDBManager.userLogout(recvData1);

        
        /**发一条测试消息给客户端 */
        let tempSendMsg = <NetMessageType.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;

        let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{
            username:this.userInfo.username,
            userid:this.userInfo.userid,
            code:NetMessageID.ERROR_CODE.IS_OK,
            des:"成功退出"
        };        

        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));

//        this.ws.close(10086,"客户端退出，服务器主动断开客户端socket");
        this.ws.terminate();
        return "handleClientLogout";
    }


    /** send error code to client */
    sendErrorCode(code:number, reason ?: string){
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

        if(reason){
            tempDataSend2.des = reason;
        }
        else {
            tempDataSend2.des = "unknown";
        }

        tempSendMsg.msgData = JSON.stringify(tempDataSend2);

        this.ws.send(JSON.stringify(tempSendMsg));
        MyUtil.outputErrorInfo("User.ts", "sendErrorCode", JSON.stringify(tempSendMsg));
    }
}

