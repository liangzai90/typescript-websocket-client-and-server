"use strict";
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
//fileName:MongoDBManager.ts
//Author:Henry
//Date:20200419
//File Description:读写mongoDB数据库
var mongodb_1 = require("mongodb");
var NetMessageID = __importStar(require("./NetMessageID"));
var MyUtil = __importStar(require("./Util"));
var dbname = 'user_list_db';
var table_register = 'user_register';
var table_logout = 'user_logout';
/**定义MongoDBManager的单例，封装了对数据库的若干操作 */
var MongoDBManager = /** @class */ (function () {
    function MongoDBManager(mongoInfo) {
    }
    ;
    MongoDBManager.setMongoDBInfo = function (mongoInfo) {
        MongoDBManager.mongoInfo.url = mongoInfo.url;
        MongoDBManager.mongoInfo.dbName = mongoInfo.dbName;
        MongoDBManager.mongoInit();
    };
    /**测试数据库连接是否OK */
    MongoDBManager.mongoInit = function () {
        mongodb_1.MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
            if (err) {
                MyUtil.outputErrorInfo("MongoDBManagers", "mongoInit", "mongoose connect failed.");
                console.log(err);
                dbClient.close();
                return;
            }
            dbClient.close();
            MyUtil.outputDebugInfo("MongoDBManagers", "mongoInit", "mongoose connect success...");
        });
    };
    /**玩家注册，请求数据库 */
    MongoDBManager.userRegister = function (regist) {
        return __awaiter(this, void 0, void 0, function () {
            var objReturn;
            return __generator(this, function (_a) {
                MyUtil.outputDebugInfo("MongoDBManager", "userRegister", "handle register");
                objReturn = {};
                objReturn.userid = 0;
                objReturn.username = regist.username;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        /**1.连接数据库服务器*/
                        mongodb_1.MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
                            var _this = this;
                            //assert.equal(err, null);
                            if (err) {
                                MyUtil.outputErrorInfo("MongoDBManager", "userRegister", "register error");
                                console.error(err);
                                objReturn.code = NetMessageID.ERROR_CODE.REGISTER_FAILED;
                                objReturn.des = "注册失败，数据库有问题";
                                resolve(objReturn);
                                dbClient.close();
                                return;
                            }
                            /**2.连接某个具体的数据库*/
                            var UserDB = dbClient.db(dbname);
                            /**3.连接数据库的某个表*/
                            var registerCollection = UserDB.collection(table_register);
                            /** 要保存到数据库的 数据内容*/
                            var oneUser = {};
                            oneUser.username = regist.username;
                            oneUser.userid = 0; /**生成的userid */
                            oneUser.password = regist.password;
                            oneUser.timestamp = new Date();
                            /**查找*/
                            var findObj = { username: regist.username };
                            (function () { return __awaiter(_this, void 0, void 0, function () {
                                var retFind, retRecord, retInsert;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, registerCollection.find(findObj).toArray()];
                                        case 1:
                                            retFind = _a.sent();
                                            console.error(retFind);
                                            if (retFind.length > 0) {
                                                objReturn.code = NetMessageID.ERROR_CODE.REGISTER_FAILED;
                                                objReturn.des = "注册失败，账号已存在";
                                                resolve(objReturn);
                                                dbClient.close();
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, registerCollection.findOneAndUpdate({ increase: 1 }, { $inc: { userid: 1 }, $set: { des: "This line record total num" } }, { "upsert": true, "returnOriginal": false })];
                                        case 2:
                                            retRecord = _a.sent();
                                            /**取出了递增的id值，把玩家userid字段赋值*/
                                            oneUser.userid = MongoDBManager.g_BaseUserID + retRecord.value.userid;
                                            return [4 /*yield*/, registerCollection.insertOne(oneUser)];
                                        case 3:
                                            retInsert = _a.sent();
                                            /**如果一切正常，会走到这里.把userid值放入返回值，传递出去 */
                                            objReturn.userid = oneUser.userid;
                                            objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
                                            objReturn.des = "注册成功";
                                            MyUtil.outputErrorInfo("MongoDBManager.ts", "userRegister", "\u65B0\u73A9\u5BB6[" + regist.username + "]\u6CE8\u518C\u6210\u529F,userid:" + objReturn.userid);
                                            resolve(objReturn);
                                            dbClient.close();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })().catch(function (error) { console.error(error); });
                        });
                    })];
            });
        });
    };
    ;
    /**玩家登陆，请求数据库 */
    MongoDBManager.userLogin = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var objReturn;
            return __generator(this, function (_a) {
                MyUtil.outputDebugInfo("MongoDBManager", "userLogin", "handle login");
                objReturn = {};
                objReturn.userid = 0;
                objReturn.username = login.username;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        /**1.连接数据库服务器*/
                        mongodb_1.MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
                            var _this = this;
                            //assert.equal(err, null);
                            if (err) {
                                MyUtil.outputErrorInfo("MongoDBManager", "userLogin", "login error");
                                console.error(err);
                                objReturn.code = NetMessageID.ERROR_CODE.LOGIN_FAILED;
                                objReturn.des = "登陆失败，数据库有问题";
                                resolve(objReturn);
                                dbClient.close();
                                return;
                            }
                            /**2.连接某个具体的数据库*/
                            var UserDB = dbClient.db(dbname);
                            /**3.连接数据库的某个表*/
                            var registerCollection = UserDB.collection(table_register);
                            /**查找*/
                            var findObj = { username: login.username };
                            (function () { return __awaiter(_this, void 0, void 0, function () {
                                var retFind;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, registerCollection.find(findObj).toArray()];
                                        case 1:
                                            retFind = _a.sent();
                                            if (retFind.length > 0) {
                                                if (retFind[0].password.match(login.password)) {
                                                    objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
                                                    objReturn.des = "登陆成功";
                                                    objReturn.userid = retFind[0].userid;
                                                    resolve(objReturn);
                                                    dbClient.close();
                                                    MyUtil.outputErrorInfo("MongoDBManager.ts", "userLogin", "\u73A9\u5BB6[" + login.username + "]\u767B\u9646\u6210\u529F,userid[" + objReturn.userid + "]");
                                                }
                                                else {
                                                    objReturn.code = NetMessageID.ERROR_CODE.LOGIN_FAILED;
                                                    objReturn.des = "登陆失败，密码错误";
                                                    resolve(objReturn);
                                                    dbClient.close();
                                                }
                                            }
                                            else {
                                                objReturn.code = NetMessageID.ERROR_CODE.LOGIN_FAILED;
                                                objReturn.des = "登陆失败，玩家信息不存在";
                                                resolve(objReturn);
                                                dbClient.close();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })().catch(function (error) { console.error(error); });
                        });
                    }).catch(function (error) { return console.error(error); })]; //如果查找失败，状态可能会卡在这，需要catch error;
            });
        });
    };
    ///TODO:数据库可能会记录玩家退出信息
    /**玩家退出，记录信息到数据库 */
    MongoDBManager.userLogout = function (logout) {
        return __awaiter(this, void 0, void 0, function () {
            var objReturn;
            return __generator(this, function (_a) {
                MyUtil.outputDebugInfo("MongoDBManager", "userLogout", "handle [" + logout.username + "]logout");
                objReturn = {};
                objReturn.userid = 0;
                objReturn.username = logout.username;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        /**1.连接数据库服务器*/
                        mongodb_1.MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
                            //assert.equal(err, null);
                            if (err) {
                                MyUtil.outputErrorInfo("MongoDBManager", "userLogout", "logout error");
                                console.error(err);
                                objReturn.code = NetMessageID.ERROR_CODE.LOGOUT_FAILED;
                                objReturn.des = "退出失败，数据库有问题";
                                resolve(objReturn);
                                dbClient.close();
                                return;
                            }
                            /**2.连接某个具体的数据库*/
                            var UserDB = dbClient.db(dbname);
                            /**3.连接数据库的某个表*/
                            var logoutCollection = UserDB.collection(table_logout);
                            var oneUser = {};
                            oneUser.username = logout.username;
                            oneUser.userid = logout.userid;
                            oneUser.timestamp = new Date();
                            oneUser.des = logout.des;
                            logoutCollection.insertOne(oneUser, function (err, res) {
                                if (err) {
                                    MyUtil.outputErrorInfo("MongoDBManager", "userLogout", "insert error");
                                    console.error(err);
                                    objReturn.code = NetMessageID.ERROR_CODE.LOGOUT_FAILED;
                                    objReturn.des = "退出失败，保存数据库失败，未知错误";
                                    objReturn.userid = 0;
                                    resolve(objReturn);
                                    dbClient.close();
                                    return;
                                }
                                objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
                                objReturn.des = "退出成功";
                                MyUtil.outputErrorInfo("MongoDBManager.ts", "userLogout", "\u73A9\u5BB6[" + logout.username + "]\u9000\u51FA\u4E86\u3002userid:" + logout.userid);
                                resolve(objReturn);
                                dbClient.close();
                            });
                        });
                    })];
            });
        });
    };
    ;
    /**存放MongoDB的若干连接信息，url, dbName */
    MongoDBManager.mongoInfo = {};
    /**最低的userid值，新玩家的userid都是在这个值后面递增 */
    MongoDBManager.g_BaseUserID = 10000;
    return MongoDBManager;
}());
exports.MongoDBManager = MongoDBManager;
//# sourceMappingURL=MongoDBManager.js.map