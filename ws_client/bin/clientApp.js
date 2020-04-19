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
//====================== S2C message ======================
ws_cient.onmessage = function (event) {
    console.log("ws.onmessage----->>>服务器发来消息：");
    //1.解析服务器发来的消息
    var objData1 = JSON.parse(event.data); ///强制类型转换<string>
    console.log("objData1:");
    console.dir(objData1);
    //2.根据 msgMainID，msgSubID，来处理不同消息
    if (NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID) {
        //handle login,register,logout response message...
        if (NetMessageID.MESSAGE_SUB_ID.REGISTER == objData1.msgSubID) {
            //TODO:1.msgData为undefine,
            //TODO:2.msgData不是合法json结构
            //TODO:3.msgData是空{}
            //TODO:4.msgData从json解析出来的object，没有我们需要的 字段名
            var objData2 = JSON.parse(objData1.msgData);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "REGISTER", "" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "REGISTER", "" + objData2.code); ////这里不会执行，但是仍然保留.  
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "REGISTER", "" + objData2.code);
            }
        }
        else if (NetMessageID.MESSAGE_SUB_ID.LOGIN == objData1.msgSubID) {
            var objData2 = JSON.parse(objData1.msgData);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "LOGIN", "" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "LOGIN", "" + objData2.code);
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "LOGIN", "" + objData2.code);
            }
        }
        else if (NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID) {
            var objData2 = JSON.parse(objData1.msgData);
            if (0 != Object.keys(objData2).length) {
                if (NetMessageID.ERROR_CODE.IS_OK == objData2.code) {
                    MyUtil.outputDebugInfo("clientApp.ts", "LOGOUT", "" + objData2.code);
                }
                else {
                    MyUtil.outputErrorInfo("clientApp.ts", "LOGOUT", "" + objData2.code);
                }
            }
            else {
                MyUtil.outputErrorInfo("clientApp.ts", "LOGOUT", "" + objData2.code);
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
        MyUtil.outputWarnInfo("clientApp.ts", "unknown message", "messageMainID:" + objData1.msgMainID + ",messageSubID:" + objData1.msgSubID);
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
function testRegister() {
    var tempSendMsg = {};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.REGISTER;
    var tempDataSend = {};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";
    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))
    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testRegister", "one client [Register]");
}
function testLogin() {
    var tempSendMsg = {};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGIN;
    var tempDataSend = {};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";
    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))
    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testLogin", "one client [Login]");
}
function testLogout() {
    var tempSendMsg = {};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;
    var tempDataSend = {};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";
    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))
    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testLogout", "one client [Logout]]");
}
////客户端定时向服务器发消息.
var tempClock = 1;
var interval = setInterval(function () {
    if (ws_cient.readyState == ws_cient.OPEN) {
        /////==============================模拟发送一条信息给服务器
        //        testRegister();
        testLogin();
        //        testLogout();
        console.log("[setInterval]-----check----[" + tempClock + "]");
        tempClock++;
    }
    else {
        clearInterval(interval);
    }
}, 3000);
MyUtil.outputDebugInfo("app.ts", "this is clientApp.", "---------------->>>>End");
//# sourceMappingURL=clientApp.js.map