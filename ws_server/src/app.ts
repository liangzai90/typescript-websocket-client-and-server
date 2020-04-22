//fileName:app.ts
//Author:Henry
//Date:20200419
//File Description:程序启动入口（配置文件配置了app.ts启动）

import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import * as NetMessageType from './NetMessageType'
import * as NetMessageID from './NetMessageID'
import * as MyUtil from './Util'
import {Users} from './Users'
import {MongoDBManager} from './MongoDBManager'
import {Authen} from './Authen'

MyUtil.outputDebugInfo("app.ts", "this is serverApp.","----------------start");

const app = express();
const server = http.createServer(app);
//TODO:如何设置最大连接数
const ws_server = new WebSocket.Server({server, maxPayload:1024});
const listenPort = 3006;

/** 定义玩家信息列表，存放所有玩家类  */
let usersMap:Map<WebSocket,Users>;
usersMap = new Map();


/** 通过 MongoDBManager 去 处理若干请求、设置若干数据等等 */
let mongoInfo:NetMessageType.MONGODB_INFO = <NetMessageType.MONGODB_INFO> {};
mongoInfo.url="mongodb://localhost";
mongoInfo.dbName="Database0421";
/**在入口的地方设置好Mongodb相关信息 */
MongoDBManager.setMongoDBInfo(mongoInfo);


////只在http访问的时候，会接收到消息
app.get('*', (req, res) => {
    MyUtil.outputDebugInfo("app.ts", "app.get","get some info.");
    // console.dir(req);
    // console.dir(res);
    console.log(req);
    console.log(res);
    
    // console.log(res);
  });


/** handle connection */
ws_server.on('connection',function handleConnection(thisServer:WebSocket, requestMsg:http.IncomingMessage ){
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------start");

    console.log("Total clients nums is:[%d]", this.clients.size);
    console.log("url is : " + requestMsg.url);

    /**玩家登陆、注册 附带的的url参数 */
    let userParmaTemp:NetMessageType.USER_LOGIN_PARMA = <NetMessageType.USER_LOGIN_PARMA>{};

    try{   
        /** 解析url得到 tempMapObj ，存放的是玩家信息 */
        let tempMapObj = MyUtil.urlToJsonObject(<string>requestMsg.url);
        if(tempMapObj.get("username")) {
            userParmaTemp.username = <string>tempMapObj.get("username");
        }
        if(tempMapObj.get("password")) {
            userParmaTemp.password = <string>tempMapObj.get("password");
        }   
        if(tempMapObj.get("act")) {
            userParmaTemp.act = Number(tempMapObj.get("act"));
        }   
    }
    catch(error){
        MyUtil.outputErrorInfo("app.ts", "connection", "登陆/注册参数有误，登陆失败/注册---return");
        console.error(error);
        thisServer.terminate();
        return ;
    }  


    try{
        (async ()=>{ //
            let authenResult = await Authen.HandleUserLoginRegister(userParmaTemp, thisServer);
    
            /** 玩家信息 */
            let userinfo = <NetMessageType.MSG_S2C_RSP_1>{};
            userinfo.userid = (<NetMessageType.MSG_S2C_RSP_1>authenResult).userid;
            userinfo.username = (<NetMessageType.MSG_S2C_RSP_1>authenResult).username;
            userinfo.des = (<NetMessageType.MSG_S2C_RSP_1>authenResult).des;
            userinfo.code = (<NetMessageType.MSG_S2C_RSP_1>authenResult).code;
    
    
            if( !(userinfo.userid === undefined)  && (userinfo.userid >0) ){
                MyUtil.outputErrorInfo("app.ts", "connection", "authenResult == true");
        
                let oneUser = new Users(thisServer, userinfo);   
                usersMap.set(thisServer, oneUser);  
                MyUtil.outputDebugInfo("app.ts", "HandleUserLoginRegister", `username:${userinfo.username},userid:${userinfo.userid}`);
            }
            else{
                MyUtil.outputErrorInfo("app.ts", "connection", "authenResult == false");
                MyUtil.outputErrorInfo("app.ts", "HandleUserLoginRegister", `username:${userinfo.username},userid:${userinfo.userid}.errcode:${userinfo.code},des:[${userinfo.des}]`);
                thisServer.terminate();
                return ;   
            }            
        })();
    }
    catch(error){
        MyUtil.outputErrorInfo("app.ts", "connection", "catch error.==严重的未知错误!!!");
        thisServer.terminate();
        throw new Error(error);
    }
        
   
    //TODO:不建议这里直接交给Users来处理，否则无法管理usersMap了，所以这里不是直接使用Users类的回调函数
    /** handle [close] Events */
    thisServer.on('close', function handleClose(code: number, reason: string){
        ////更新usersMap
        MyUtil.outputDebugInfo("app.ts", "close", "--------------");
        console.log(`one user closed.username:${usersMap.get(thisServer)?.getUserInfo().username}`);   
        usersMap.get(thisServer)?.handleClose(code, reason);
        usersMap.delete(thisServer);
    });
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------End");
});


server.listen(listenPort, ()=>{
    MyUtil.outputDebugInfo("app.ts", "this is serverApp.",`Server is running. listening port is:${listenPort}`);
});

MyUtil.outputDebugInfo("app.ts", "this is serverApp.","----------------End");
