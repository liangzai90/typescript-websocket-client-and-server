"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NetMessageID = __importStar(require("./NetMessageID"));
var MyUtil = __importStar(require("./Util"));
////client ask server
var ws_1 = __importDefault(require("ws"));
MyUtil.outputDebugInfo("app.ts", "this is clientApp.", "---------------->>>>start");
var listenPort = 3006; // origin 
//const ws_cient = new WebSocket(`ws://127.0.0.1:${listenPort}`);
/**模拟一个客户端数据 */
var OneUser = {
    username: "henry1",
    password: "123456",
    act: 1 //1：注册，2:登录，3：退出*/
};
var url = "ws://127.0.0.1:3006/";
var params = "?username=" + OneUser.username + "&password=" + OneUser.password + "&act=" + OneUser.act;
/** username:用户名*/
/**password:用户密码*/
/**act：用户行为.0:默认值（服务器不做任何处理，客户端会连不上） 1：注册，2:登录，3：退出*/
//const ws_cient = new WebSocket("?username=henry&password=12345&act=1");
/** 客户端通过带参数的url请求服务器*/
var ws_cient = new ws_1.default(url + params);
//ws://127.0.0.1:3006/path?token=abc
//constructor(address: string | url.URL, options?: WebSocket.ClientOptions | http.ClientRequestArgs);
// constructor(address: string | url.URL, protocols?: string | string[], options?: WebSocket.ClientOptions | http.ClientRequestArgs);
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
//====================== S2C message ======================
ws_cient.onmessage = function (event) {
    console.log("ws.onmessage----->>>服务器发来消息：");
    console.log(event.data);
    //1.解析服务器发来的消息
    var objData1 = JSON.parse(event.data); ///强制类型转换<string>
    //2.根据 msgMainID，msgSubID，来处理不同消息
    if (NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID) {
        //handle login,register,logout response message...
        if (NetMessageID.MESSAGE_SUB_ID.REGISTER == objData1.msgSubID) {
            //TODO:1.msgData为undefine,
            //TODO:2.msgData不是合法json结构
            //TODO:3.msgData是空{}
            //TODO:4.msgData从json解析出来的object，没有我们需要的 字段名
            var objData2 = JSON.parse(objData1.msgData);
            console.error("username:" + objData2.username + ",userid:" + objData2.userid + ",code:" + objData2.code + ",des:" + objData2.des);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "onmessage-REGISTER", "\u6CE8\u518C\u6210\u529F\u3002code:" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "onmessage-REGISTER ERROR", "\u6CE8\u518C\u5931\u8D25\u3002code:" + objData2.code);
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "onmessage-REGISTER", "\u6CE8\u518C\u5931\u8D25\u3002code:" + objData2.code);
            }
        }
        else if (NetMessageID.MESSAGE_SUB_ID.LOGIN == objData1.msgSubID) {
            var objData2 = JSON.parse(objData1.msgData);
            console.error("username:" + objData2.username + ",userid:" + objData2.userid + ",code:" + objData2.code + ",des:" + objData2.des);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "onmessage-LOGIN", "\u767B\u9646\u6210\u529F\uFF0Ccode:" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "onmessage-LOGIN ERROR", "\u767B\u9646\u5931\u8D25\uFF0Ccode:" + objData2.code);
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "onmessage-LOGIN", "" + objData2.code);
            }
        }
        else if (NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID) {
            var objData2 = JSON.parse(objData1.msgData);
            console.error("username:" + objData2.username + ",userid:" + objData2.userid + ",code:" + objData2.code + ",des:" + objData2.des);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "onmessage-LOGOUT", "" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "onmessage-LOGOUT ERROR", "" + objData2.code);
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "onmessage-LOGOUT", "" + objData2.code);
            }
        }
        else {
            MyUtil.outputWarnInfo("clientApp.ts", "unknown message", "messageSubID:" + objData1.msgSubID);
        }
    }
    else if (NetMessageID.MESSAGE_MAIN_ID.ERROR_CODE == objData1.msgMainID) {
        MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", "messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID);
        var objData2 = JSON.parse(objData1.msgData);
        ;
        if (NetMessageID.ERROR_CODE.REGISTER_FAILED == objData2.code) {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", "REGISTER_FAILED,messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID + ",des:" + objData2.des);
        }
        else if (NetMessageID.ERROR_CODE.LOGIN_FAILED == objData2.code) {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", "LOGIN_FAILED,messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID + ",des:" + objData2.des);
        }
        else if (NetMessageID.ERROR_CODE.LOGOUT_FAILED == objData2.code) {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", "LOGOUT_FAILED,messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID + ",des:" + objData2.des);
        }
        else {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", "[unknown],messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID + ",des:" + objData2.des);
        }
    }
    else {
        MyUtil.outputWarnInfo("clientApp.ts", "unknown message", "event.data");
        console.error(event.data);
    }
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
/**测试消息。客户端和服务器互发一条测试消息 */
function testSayHello() {
    var tempSendMsg = {};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.SAY_HELLO;
    //say hello message
    var tempDataSend = {};
    tempDataSend.username = "I am client";
    tempDataSend.des = "Hello,server. I am client.";
    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testSayHello", "" + JSON.stringify(tempSendMsg));
}
/**模拟玩家退出操作，目前是交给定时器处理 */
function testLogout() {
    var tempSendMsg = {};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;
    //say hello message
    var tempDataSend = {};
    tempDataSend.username = OneUser.username;
    tempDataSend.userid = 456789;
    tempDataSend.des = "client quit.";
    tempDataSend.code = 12345;
    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testLogout", "" + JSON.stringify(tempSendMsg));
}
function testAlotRegister() {
    for (var i = 0; i < 100; i++) {
        /**模拟一个客户端数据 */
        var OneUser2 = {
            username: "henryA",
            password: "123456",
            act: 1 //1：注册，2:登录，3：退出*/
        };
        OneUser2.username = OneUser2.username + i;
        var params_2 = "?username=" + OneUser2.username + "&password=" + OneUser2.password + "&act=" + OneUser2.act;
        var ws_cient_2 = new ws_1.default(url + params_2);
    }
}
////客户端定时向服务器发消息.
var tempClockA = 1;
var tempClockB = 1;
var tempColckC = 1;
var tempColckD = 1;
// const intervalA = setInterval(function () {
//     if(ws_cient.readyState == ws_cient.OPEN)
//     {
//         /////==============================模拟发送一条信息给服务器
//         testLogout();        
//         console.log(`[setInterval]-----check----[${tempClockA}]`);    
//         tempClockA++;
//     }
//     clearInterval(intervalA);
// }, 15000);
// /**测试和服务器互发消息 */
// const intervalB = setInterval(function () {
//     if(ws_cient.readyState == ws_cient.OPEN)
//     {
//     /////==============================模拟发送一条信息给服务器
//         testSayHello(); 
//         console.log(`[setInterval]-----check----[${tempClockB}]`);    
//         tempClockB++;
//     }
//     else
//     {
//         clearInterval(intervalB);
//     }
// }, 2000);
// /**发送 ping 心跳 */
// const intervalC = setInterval(()=>{
//     if(ws_cient.readyState == ws_cient.OPEN){
//         ws_cient.ping("client is alive");
//     }
//     else {
//         clearInterval(intervalC);
//     }
// },3000);
/**定时执行 批量注册操作 */
var intervalC = setInterval(function () {
    testAlotRegister();
    clearTimeout(intervalC);
}, 2000);
MyUtil.outputDebugInfo("app.ts", "this is clientApp.", "---------------->>>>End");
//# sourceMappingURL=clientApp.js.map