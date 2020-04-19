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

MyUtil.outputDebugInfo("app.ts", "this is serverApp.","----------------start");

const app = express();
const server = http.createServer(app);
////如何设置最大连接数？
const ws_server = new WebSocket.Server({server, maxPayload:1024});
const listenPort = 3006;

////定义玩家信息列表，存放所有玩家类  
//let userlist:Set<Users>;
let usersMap:Map<WebSocket,Users>;
usersMap = new Map();


///通过mongoObj去 处理若干请求、设置若干数据等等
let mongoInfo:NetMessageType.MONGODB_INFO = <NetMessageType.MONGODB_INFO> {};
mongoInfo.url="mongodb://localhost";
mongoInfo.dbName="Database0419";
let mongoObj = new MongoDBManager(mongoInfo);




////只在http访问的时候，会接收到消息
app.get('*', (req, res) => {
    MyUtil.outputDebugInfo("app.ts", "app.get","get some info.");
    // console.dir(req);
    // console.dir(res);
    console.log(req);
    console.log(res);
    
    // console.log(res);
  });



  ////handle connection
ws_server.on('connection',function handleConnection(thisServer:WebSocket, requestMsg:http.IncomingMessage ){
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------start");
    console.log("Total clients nums is:[%d]", this.clients.size);

    //1.create a user
    let oneUser = new Users(thisServer, mongoObj);    
    //2.add this user to usersMap
    usersMap.set(thisServer, oneUser);  
    
    //====================handle [message]  
    thisServer.on('message', function handleIncoming(recvData: WebSocket.Data){
        MyUtil.outputDebugInfo("app.ts", "message", "message comming..........start");
        ////Users类处理接收的数据
//        (<Users>usersMap.get(thisServer)).UserReceiveMsg(recvData);

        //TODO:在使用 usersMap前，需要做非空的判断
        usersMap.get(thisServer)?.handleIncoming(recvData);
        
        MyUtil.outputDebugInfo("app.ts", "message", "message comming..........End");
    });


    //====================handle [error]
    thisServer.on('error', function handleError(error: Error){
        MyUtil.outputErrorInfo("app.ts", "error", "-------------->>>start");
        usersMap.get(thisServer)?.handleError(error);
        console.dir(error);
        MyUtil.outputErrorInfo("app.ts", "error", "-------------->>>End");
    });


    //====================handle [close]
    thisServer.on('close', function handleClose(code: number, reason: string){
        ////更新usersMap
        MyUtil.outputDebugInfo("app.ts", "close", "--------------");
        console.log(`one user closed.username:${usersMap.get(thisServer)?.username}`);   
        usersMap.get(thisServer)?.handleClose(code, reason);
        usersMap.delete(thisServer);
    });


    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------End");
});


server.listen(listenPort, ()=>{
    console.log(`Server is running. listening port is:${listenPort}`)
});


MyUtil.outputDebugInfo("app.ts", "this is serverApp.","----------------End");
