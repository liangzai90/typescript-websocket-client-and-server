import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import * as NetMessage from './NetMessage'

const app = express();
const server = http.createServer(app);
const ws_server = new WebSocket.Server({server, maxPayload:1024});
const listenPort = 3006;
console.log("this is serverApp.--------------start");

////只在http访问的时候，会接收到消息
app.get('*', (req, res) => {
    console.log("[serverApp.ts]:[app.get]:get some info");
    // console.dir(req);
    // console.dir(res);
    console.log(req);
    console.log(res);
    
    // console.log(res);
  });


// // Events
// on(event: 'close', listener: (this: WebSocket, code: number, reason: string) => void): this;
// on(event: 'error', listener: (this: WebSocket, err: Error) => void): this;
// on(event: 'upgrade', listener: (this: WebSocket, request: http.IncomingMessage) => void): this;
// on(event: 'message', listener: (this: WebSocket, data: WebSocket.Data) => void): this;
// on(event: 'open' , listener: (this: WebSocket) => void): this;
// on(event: 'ping' | 'pong', listener: (this: WebSocket, data: Buffer) => void): this;
// on(event: 'unexpected-response', listener: (this: WebSocket, request: http.ClientRequest, response: http.IncomingMessage) => void): this;
// on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;




  ////handle connection
ws_server.on('connection',function handleConnection(thisServer:WebSocket, requestMsg:http.IncomingMessage ){

    console.log("--------------[connection]-------------start");

    console.log("thisServer:");
    console.dir(thisServer);
    
    console.log("requestmsg:");
    console.dir(requestMsg);

    console.log("this:")
    console.dir(this);

    // interface Set<T> {
    //     add(value: T): this;
    //     clear(): void;
    //     delete(value: T): boolean;
    //     forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    //     has(value: T): boolean;
    //     readonly size: number;
    // }
    
    // array.forEach(element => {        
    // });

    let tempNum=0;
    this.clients.forEach(Element=>{
        tempNum++;
        console.log("print websocket.[%d]", tempNum);
    });

    if(this.clients.has(thisServer))
    {
        console.log("has this server.");
    }
    else
    {
        console.log("Do not has this server.");
    }


    

    //====================handle [error]
    // on(event: 'error', listener: (this: WebSocket, err: Error) => void): this;
    // interface Error {
    //     name: string;
    //     message: string;
    //     stack?: string;
    // }
    thisServer.on('error', function handleError(error: Error){
        console.log("----------------[error]---------------->>>start");
        console.dir(error);
        console.log("----------------[error]---------------->>>End");
    });


    //====================handle [message]  
    // on(event: 'message', listener: (this: WebSocket, data: WebSocket.Data) => void): this;
    // type Data = string | Buffer | ArrayBuffer | Buffer[];
    thisServer.on('message', function handleIncoming(recvData: WebSocket.Data){
        console.log("[message]:message comming..........start");
        console.log(recvData);

        ///1.json 字符串转为 obj
        let objData = JSON.parse(<string>recvData);  ///强制类型转换<string>
        console.log("c2s:");
        console.dir(objData);
        ///2.再根据 objData.msgID 去判断
        


        

        
        ///===============================================发送一条信息给客户端start
        let tempSendMsg = <NetMessage.MSG_TYPE>{};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 666;
        tempSendMsg.msgMainID = 1;
        tempSendMsg.msgSubID = 2;

        let tempDataSend = {
            "name":"到此一游",
            "month":4,
            "arrTest":[1,2,3,4,5,6]
        };
        ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
        tempSendMsg.msgData = JSON.stringify(tempDataSend);

        //打印发送给客户端的消息
        //console.log(JSON.stringify(tempSendMsg))

        ///obj转为json字符串，发送给客户端
        thisServer.send(JSON.stringify(tempSendMsg));
        //====================================================发送一条信息给客户端End



        console.log("[message]:message comming..........End");
    });


    //====================handle [close]
    // on(event: 'close', listener: (this: WebSocket, code: number, reason: string) => void): this;
    thisServer.on('close', function handleClose(code: number, reason: string){
        console.log("[close]:handleClose: handle server close..........");
        console.dir(code);
        console.dir(reason);
    });


    console.log("--------------[connection]-------------End");

});


server.listen(listenPort, ()=>{
    console.log(`Server is running. listening port is:${listenPort}`)
});

console.log("this is serverApp.--------------End");
