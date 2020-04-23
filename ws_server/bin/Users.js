"use strict";
//fileName:Users.ts
//Author:Henry
//Date:20200419
//File Description:客户端类，处理客户端的消息逻辑
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var MongoDBManager_1 = require("./MongoDBManager");
/** 定义Users类 */
var Users = /** @class */ (function () {
    function Users(ws, userInfo) {
        var _this = this;
        this.ws = ws;
        /**保存玩家信息 */
        this.userInfo = {};
        //============================= handle message =============================
        /** 消息入口，服务器 接收并处理 客户端发来的消息.根据主消息号、子消息号去判断具体消息   */
        this.handleIncoming = function (recvData) {
            MyUtil.outputDebugInfo("Users", "handleIncoming", "One User [handleIncoming] message");
            ///1.json 字符串转为 obj
            var objData1 = JSON.parse(recvData); ///强制类型转换<string>
            console.log("c2s:" + objData1);
            //client say hello to server. server say hello to client.
            if (NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID) {
                if (NetMessageID.MESSAGE_SUB_ID.SAY_HELLO == objData1.msgSubID) {
                    _this.handleClientSayHello(objData1.msgData);
                }
                else if (NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID) {
                    _this.handleClientLogout(objData1.msgData);
                }
            }
        };
        /**处理 socket的error */
        this.handleError = function (error) {
            MyUtil.outputDebugInfo("Users", "handleError", "handle error");
        };
        this.userInfo.username = userInfo.username;
        this.userInfo.userid = userInfo.userid;
        this.userInfo.code = userInfo.code;
        this.userInfo.des = userInfo.des;
        this.loginSuccess = true;
        MyUtil.outputDebugInfo("Users", "constructor", "create a new users: username:" + this.userInfo.username + ",userID:" + this.userInfo.userid);
        this.init();
    }
    /**返回玩家信息 */
    Users.prototype.getUserInfo = function () {
        return this.userInfo;
    };
    ;
    /** 初始化Users类，并绑定消息路由 */
    Users.prototype.init = function () {
        this.ws.on('message', this.handleIncoming);
        // this.ws.on('ping',(data)=>{console.log(data)});
    };
    /**处理 客户端断开连接 */
    Users.prototype.handleClose = function (code, reason) {
        MyUtil.outputDebugInfo("Users", "handleClose", "handle close");
    };
    //========================= S2C Message ================================
    /**处理客户端的 hello 消息 */
    Users.prototype.handleClientSayHello = function (msgStr) {
        /**服务器解析客户的消息内容 */
        var recvData1 = {};
        var objData1 = JSON.parse(msgStr);
        recvData1.username = objData1.username;
        recvData1.des = objData1.des;
        MyUtil.outputDebugInfo("Users", "handleClientSayHello", "Server receive client [" + recvData1.username + "] ,message:" + recvData1.des + ".");
        MyUtil.outputDebugInfo("Users", "handleClientSayHello", "Server say Hello to client too...");
        /**发一条测试消息给客户端 */
        var tempSendMsg = {};
        tempSendMsg.msgTimeStamp = new Date();
        tempSendMsg.msgLength = 1;
        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.SAY_HELLO;
        var tempDataSend2 = {
            username: "I am Server.",
            des: "Server say hello to client."
        };
        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
        this.ws.send(JSON.stringify(tempSendMsg));
    };
    /**处理客户端的退出消息 */
    Users.prototype.handleClientLogout = function (msgStr) {
        return __awaiter(this, void 0, void 0, function () {
            var recvData1, objData1, rerValue, tempSendMsg, tempDataSend2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recvData1 = {};
                        objData1 = JSON.parse(msgStr);
                        // userInfo
                        recvData1.username = this.userInfo.username;
                        recvData1.userid = this.userInfo.userid;
                        recvData1.des = objData1.des;
                        MyUtil.outputDebugInfo("Users", "handleClientLogout", "Server receive client [" + recvData1.username + "] ,message:" + recvData1.des + ".");
                        MyUtil.outputDebugInfo("Users", "handleClientLogout", "client logout");
                        return [4 /*yield*/, MongoDBManager_1.MongoDBManager.userLogout(recvData1)];
                    case 1:
                        rerValue = _a.sent();
                        tempSendMsg = {};
                        tempSendMsg.msgTimeStamp = new Date();
                        tempSendMsg.msgLength = 1;
                        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
                        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;
                        tempDataSend2 = {
                            username: this.userInfo.username,
                            userid: this.userInfo.userid,
                            code: NetMessageID.ERROR_CODE.IS_OK,
                            des: "成功退出"
                        };
                        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
                        this.ws.send(JSON.stringify(tempSendMsg));
                        //        this.ws.close(10086,"客户端退出，服务器主动断开客户端socket");
                        this.ws.terminate();
                        return [2 /*return*/, "handleClientLogout"];
                }
            });
        });
    };
    /** send error code to client */
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