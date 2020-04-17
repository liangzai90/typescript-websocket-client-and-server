"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("[clientApp.ts]------------>>>>start");
////client ask server
var ws_1 = __importDefault(require("ws"));
var listenPort = 3006;
var ws_cient = new ws_1.default("ws://127.0.0.1:" + listenPort);
// onerror: (event: WebSocket.ErrorEvent) => void;
// interface ErrorEvent {
//     error: any;
//     message: string;
//     type: string;
//     target: WebSocket;
// }
// onopen: (event: WebSocket.OpenEvent) => void;
// interface OpenEvent {
//     target: WebSocket;
// }
ws_cient.onopen = function (event) {
    console.log("Websocket \u8FDE\u63A5\u72B6\u6001\uFF1A " + event.target.readyState);
};
//// onmessage: (event: WebSocket.MessageEvent) => void;
// interface MessageEvent {
//     data: Data;
//     type: string;
//     target: WebSocket;
// }
ws_cient.onmessage = function (event) {
    console.log("ws.onmessage----->>>服务器发来消息：");
    //1.解析服务器发来的消息
    var objData1 = JSON.parse(event.data); ///强制类型转换<string>
    console.log("objData1:");
    console.dir(objData1);
    //2.根据 msgMainID，msgSubID，来处理不同消息
    //3.取出自定义的数据，转为obj方便访问和操作
    var objData2 = JSON.parse(objData1.msgData); ///强制类型转换<string>
    console.log("objData2:");
    console.dir(objData2);
    console.log("event:");
    console.log("event.data:" + event.data);
    console.log("event.type:" + event.type);
    console.log("event.target.readyState:" + event.target.readyState);
};
// onclose: (event: WebSocket.CloseEvent) => void;
// interface CloseEvent {
//     wasClean: boolean;
//     code: number;
//     reason: string;
//     target: WebSocket;
// }
ws_cient.onclose = function (event) {
    console.log("ws.onclose------->>>WebSocket连接关闭");
    console.log(event.wasClean);
    console.log(event.code);
    console.log(event.reason);
    console.log(event.target);
};
////客户端定时向服务器发消息.
var tempClock = 1;
var interval = setInterval(function () {
    if (ws_cient.readyState == ws_cient.OPEN) {
        //        ws_cient.send(`客户端发来消息...client to server: hello server.[${tempClock}]`);
        /////==============================模拟发送一条信息给服务器
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 777;
        tempSendMsg.msgMainID = 1;
        tempSendMsg.msgSubID = 1;
        var tempDataSend = {
            "name": "客户端消息22",
            "month": 7777,
            "password": 888
        };
        ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
        tempSendMsg.msgData = JSON.stringify(tempDataSend);
        //console.log(JSON.stringify(tempSendMsg))
        ///obj转为json字符串，发送给客户端
        ws_cient.send(JSON.stringify(tempSendMsg));
        console.log("[setInterval]-----check----[" + tempClock + "]");
        tempClock++;
    }
    else {
        clearInterval(interval);
    }
}, 3000);
console.log("[clientApp.ts]------------>>>>End");
//# sourceMappingURL=clientApp.js.map