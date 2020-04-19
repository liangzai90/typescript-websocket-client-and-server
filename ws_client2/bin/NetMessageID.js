"use strict";
//fileName:NetMessageID.ts
//Author:Henry
//Date:20200419
//File Description:定义服务器和客户端交互的消息号
Object.defineProperty(exports, "__esModule", { value: true });
///主消息号.msgMainID,msgSubID:根据id去区分是什么消息，做不同处理
var MESSAGE_MAIN_ID;
(function (MESSAGE_MAIN_ID) {
    MESSAGE_MAIN_ID[MESSAGE_MAIN_ID["ERROR_CODE"] = 0] = "ERROR_CODE";
    MESSAGE_MAIN_ID[MESSAGE_MAIN_ID["MAIN_ID_LOGIN_REGISTER"] = 1] = "MAIN_ID_LOGIN_REGISTER";
})(MESSAGE_MAIN_ID = exports.MESSAGE_MAIN_ID || (exports.MESSAGE_MAIN_ID = {}));
;
//次消息号
var MESSAGE_SUB_ID;
(function (MESSAGE_SUB_ID) {
    MESSAGE_SUB_ID[MESSAGE_SUB_ID["REGISTER"] = 1] = "REGISTER";
    MESSAGE_SUB_ID[MESSAGE_SUB_ID["LOGIN"] = 2] = "LOGIN";
    MESSAGE_SUB_ID[MESSAGE_SUB_ID["LOGOUT"] = 3] = "LOGOUT";
})(MESSAGE_SUB_ID = exports.MESSAGE_SUB_ID || (exports.MESSAGE_SUB_ID = {}));
//错误码
var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE[ERROR_CODE["IS_OK"] = 0] = "IS_OK";
    ERROR_CODE[ERROR_CODE["REGISTER_FAILED"] = 1] = "REGISTER_FAILED";
    ERROR_CODE[ERROR_CODE["LOGIN_FAILED"] = 2] = "LOGIN_FAILED";
    ERROR_CODE[ERROR_CODE["LOGOUT_FAILED"] = 3] = "LOGOUT_FAILED";
})(ERROR_CODE = exports.ERROR_CODE || (exports.ERROR_CODE = {}));
//# sourceMappingURL=NetMessageID.js.map