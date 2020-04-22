"use strict";
//fileName:Authen.ts
//Author:Henry
//Date:20200420
//File Description:处理玩家认证、注册请求
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
var Authen = /** @class */ (function () {
    function Authen() {
    }
    //
    Authen.HandleUserLoginRegister = function (userParmas, thisServer) {
        return __awaiter(this, void 0, void 0, function () {
            var retValue, retValue, tempRet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "handle register and login");
                        if (!(NetMessageID.MESSAGE_SUB_ID.REGISTER == userParmas.act)) return [3 /*break*/, 2];
                        return [4 /*yield*/, MongoDBManager_1.MongoDBManager.userRegister(userParmas)];
                    case 1:
                        retValue = _a.sent();
                        MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "---register---userid:[" + retValue.userid + "],username:[" + retValue.username + "],code:" + retValue.code + ",des:" + retValue.des);
                        /**把登陆/注册的反馈数据发给客户端.s2c ，不需要同步， */
                        Authen.registerRsp_s(thisServer, retValue);
                        if (NetMessageID.ERROR_CODE.IS_OK == retValue.code) {
                            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "Register success. username:[" + retValue.username + "],");
                        }
                        else {
                            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "Register failed");
                        }
                        return [2 /*return*/, retValue]; //userid >0 ，且不为空，则判断玩家存在
                    case 2:
                        if (!(NetMessageID.MESSAGE_SUB_ID.LOGIN == userParmas.act)) return [3 /*break*/, 4];
                        return [4 /*yield*/, MongoDBManager_1.MongoDBManager.userLogin(userParmas)];
                    case 3:
                        retValue = _a.sent();
                        MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "---login---userid:[" + retValue.userid + "],username:[" + retValue.username + "],code:" + retValue.code + ",des:" + retValue.des);
                        /**把登陆/注册的反馈数据发给客户端.s2c ，不需要同步， */
                        // let retValue2 =  await Authen.loginRsp_s(thisServer,(<NetMessageType.MSG_S2C_RSP_1>retValue) );
                        Authen.loginRsp_s(thisServer, retValue);
                        if (NetMessageID.ERROR_CODE.IS_OK == retValue.code) {
                            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "Login success. username:[" + retValue.username + "],");
                        }
                        else {
                            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister", "bLoginRegisterSuccess == false");
                        }
                        return [2 /*return*/, retValue]; //userid >0 ，且不为空，则判断玩家存在
                    case 4:
                        MyUtil.outputErrorInfo("Authen", "HandleUserLoginRegister", "user[" + userParmas.username + "] other act");
                        console.error(userParmas);
                        tempRet = {};
                        return [2 /*return*/, tempRet];
                }
            });
        });
    };
    ;
    /**服务器给客户端注册反馈*/
    Authen.registerRsp_s = function (thisServer, retVal) {
        return new Promise(function (resolve, reject) {
            MyUtil.outputDebugInfo("Authen", "registerRsp", " success.");
            var tempSendMsg = {};
            tempSendMsg.msgTimeStamp = new Date();
            tempSendMsg.msgLength = 1;
            tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
            tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.REGISTER;
            var tempDataSend2 = {};
            tempDataSend2.code = retVal.code;
            tempDataSend2.des = retVal.des;
            tempDataSend2.userid = retVal.userid;
            tempDataSend2.username = retVal.username;
            tempSendMsg.msgData = JSON.stringify(tempDataSend2);
            thisServer.send(JSON.stringify(tempSendMsg));
            resolve("registerRsp_s success");
        });
    };
    ;
    /**服务器给客户端登陆反馈*/
    Authen.loginRsp_s = function (thisServer, retVal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        MyUtil.outputDebugInfo("Authen", "loginRsp", " success.");
                        var tempSendMsg = {};
                        tempSendMsg.msgTimeStamp = new Date();
                        tempSendMsg.msgLength = 1;
                        tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
                        tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGIN;
                        var tempDataSend2 = {};
                        tempDataSend2.code = retVal.code;
                        tempDataSend2.des = retVal.des;
                        tempDataSend2.userid = retVal.userid;
                        tempDataSend2.username = retVal.username;
                        tempSendMsg.msgData = JSON.stringify(tempDataSend2);
                        thisServer.send(JSON.stringify(tempSendMsg));
                        resolve("loginRsp_s success");
                    })];
            });
        });
    };
    ;
    return Authen;
}());
exports.Authen = Authen;
//# sourceMappingURL=Authen.js.map