"use strict";
//fileName:Users.ts
//Author:Henry
//Date:20200419
//File Description:客户端类，处理客户端的消息逻辑
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var NetMessageID = __importStar(require("./NetMessageID"));
var MyUtil = __importStar(require("./Util"));
//定义Users类
var Users = /** @class */ (function () {
    //uname:string;////最好是在构造函数里面就设置好玩家的信息...
    function Users(ws, mongodb) {
        var _this = this;
        this.ws = ws;
        this.mongodb = mongodb;
        this.username = "unkonwn Name";
        this.password = "unkonwn Pwd";
        //============================= callback function =============================
        //code: 0 ok, 1:error
        //reason: description the error. or other . 
        this.registerCallback = function (code, reason) {
            MyUtil.outputDebugInfo("Users", "registerCallback", " register");
            if (NetMessageID.ERROR_CODE.IS_OK == code) {
                _this.registerRsp(code, reason);
            }
            else {
                _this.sendErrorCode(code, reason);
            }
        };
        this.loginCallback = function (code, reason) {
            MyUtil.outputDebugInfo("Users", "loginCallback", " login");
            if (NetMessageID.ERROR_CODE.IS_OK == code) {
                _this.loginRsp(code, reason);
            }
            else {
                _this.sendErrorCode(code, reason);
            }
        };
        this.logoutCallback = function (code, reason) {
            MyUtil.outputDebugInfo("Users", "logoutCallback", " logout");
            _this.logoutRsp(code, reason);
        };
        this.loginSuccess = false;
        MyUtil.outputDebugInfo("Users", "constructor", "create a new users");
    }
    ;
    //============================= handle message =============================
    //接收数据
    Users.prototype.handleIncoming = function (recvData) {
        MyUtil.outputDebugInfo("Users", "handleIncoming", "One User [handleIncoming] message");
        ///1.json 字符串转为 obj
        var objData1 = JSON.parse(recvData); ///强制类型转换<string>
        console.log("c2s:" + objData1);
        ///2.judge the msgID.
        if (NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID) {
            ///处理玩家的 注册请求 信息
            if (NetMessageID.MESSAGE_SUB_ID.REGISTER == objData1.msgSubID) {
                var objData2 = JSON.parse(objData1.msgData);
                if (0 != Object.keys(objData2).length) {
                    MyUtil.outputDebugInfo("Users", "handleIncoming", "handle user Register request");
                    //TODO:这里必须用箭头函数写，否则this变化，找不到回调函数了
                    this.mongodb.userRegister(objData2, this.registerCallback);
                }
                else {
                    MyUtil.outputDebugInfo("Users", "handleInComing", "invalid data..1");
                }
            }
            ///处理玩家的 登陆请求 信息
            else if (NetMessageID.MESSAGE_SUB_ID.LOGIN == objData1.msgSubID) {
                var objData2 = JSON.parse(objData1.msgData);
                if (0 != Object.keys(objData2).length) {
                    MyUtil.outputDebugInfo("Users", "handleIncoming", "handle user Login request");
                    this.mongodb.userLogin(objData2, this.loginCallback);
                }
                else {
                    MyUtil.outputDebugInfo("Users", "handleInComing", "invalid data..2");
                }
            }
            //处理玩家的 退出请求 信息
            else if (NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID) {
                var objData2 = JSON.parse(objData1.msgData);
                if (0 != Object.keys(objData2).length) {
                    MyUtil.outputDebugInfo("Users", "handleIncoming", "handle user Logout request");
                    this.mongodb.userLogout(objData2, this.logoutCallback);
                }
                else {
                    MyUtil.outputDebugInfo("Users", "handleInComing", "invalid data..3");
                }
            }
            else {
                MyUtil.outputErrorInfo("Users", "handleIncoming", "some unkonwn error..1");
            }
        }
        else {
            MyUtil.outputErrorInfo("Users", "handleIncoming", "some unkonwn error..2");
        }
    };
    Users.prototype.handleError = function (error) {
        MyUtil.outputDebugInfo("Users", "handleError", "handle error");
    };
    Users.prototype.handleClose = function (code, reason) {
        MyUtil.outputDebugInfo("Users", "handleClose", "handle close");
    };
    //============================= other =============================
    Users.prototype.registerRsp = function (state, reason) {
        MyUtil.outputDebugInfo("Users", "registerRsp", " success.");
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.REGISTER;
        var tempDataSend2 = {
            "code": NetMessageID.ERROR_CODE.IS_OK,
            "des": reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
    };
    Users.prototype.loginRsp = function (state, reason) {
        MyUtil.outputDebugInfo("Users", "loginRsp", " success.");
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGIN;
        var tempDataSend2 = {
            "code": NetMessageID.ERROR_CODE.IS_OK,
            "des": reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
    };
    Users.prototype.logoutRsp = function (state, reason) {
        MyUtil.outputDebugInfo("Users", "logoutRsp", " success or failed.");
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;
        var tempDataSend2 = {
            "code": NetMessageID.ERROR_CODE.IS_OK,
            "des": reason
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
    };
    // send error code to client
    Users.prototype.sendErrorCode = function (code, reason) {
        console.log("error code: " + code);
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.ERROR_CODE;
        tempSendMsg.msgSubID = 0; //没有子id，暂时给0
        var tempDataSend2 = {
            "code": code,
            "des": "unknown"
        };
        if (reason) {
            tempDataSend2.des = reason;
        }
        else {
            tempDataSend2.des = "unknown";
        }
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
        MyUtil.outputErrorInfo("User.ts", "sendErrorCode", JSON.stringify(tempSendMsg));
    };
    return Users;
}());
exports.Users = Users;
//# sourceMappingURL=Users.js.map