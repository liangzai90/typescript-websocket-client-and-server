"use strict";
//fileName:app.ts
//Author:Henry
//Date:20200419
//File Description:程序启动入口（配置文件配置了app.ts启动）
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var ws_1 = __importDefault(require("ws"));
var MyUtil = __importStar(require("./Util"));
var Users_1 = require("./Users");
var MongoDBManager_1 = require("./MongoDBManager");
var Authen_1 = require("./Authen");
MyUtil.outputDebugInfo("app.ts", "this is serverApp.", "----------------start");
var app = express_1.default();
var server = http_1.default.createServer(app);
//TODO:如何设置最大连接数
var ws_server = new ws_1.default.Server({ server: server, maxPayload: 1024 });
var listenPort = 3006;
/** 定义玩家信息列表，存放所有玩家类  */
var usersMap;
usersMap = new Map();
/** 通过 MongoDBManager 去 处理若干请求、设置若干数据等等 */
var mongoInfo = {};
mongoInfo.url = "mongodb://localhost";
mongoInfo.dbName = "Database0421";
/**在入口的地方设置好Mongodb相关信息 */
MongoDBManager_1.MongoDBManager.setMongoDBInfo(mongoInfo);
////只在http访问的时候，会接收到消息
app.get('*', function (req, res) {
    MyUtil.outputDebugInfo("app.ts", "app.get", "get some info.");
    // console.dir(req);
    // console.dir(res);
    console.log(req);
    console.log(res);
    // console.log(res);
});
/** handle connection */
ws_server.on('connection', function handleConnection(thisServer, requestMsg) {
    var _this = this;
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------start");
    console.log("Total clients nums is:[%d]", this.clients.size);
    console.log("url is : " + requestMsg.url);
    /**玩家登陆、注册 附带的的url参数 */
    var userParmaTemp = {};
    try {
        /** 解析url得到 tempMapObj ，存放的是玩家信息 */
        var tempMapObj = MyUtil.urlToJsonObject(requestMsg.url);
        if (tempMapObj.get("username")) {
            userParmaTemp.username = tempMapObj.get("username");
        }
        if (tempMapObj.get("password")) {
            userParmaTemp.password = tempMapObj.get("password");
        }
        if (tempMapObj.get("act")) {
            userParmaTemp.act = Number(tempMapObj.get("act"));
        }
    }
    catch (error) {
        MyUtil.outputErrorInfo("app.ts", "connection", "登陆/注册参数有误，登陆失败/注册---return");
        console.error(error);
        thisServer.terminate();
        return;
    }
    try {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var authenResult, userinfo, oneUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Authen_1.Authen.HandleUserLoginRegister(userParmaTemp, thisServer)];
                    case 1:
                        authenResult = _a.sent();
                        userinfo = {};
                        userinfo.userid = authenResult.userid;
                        userinfo.username = authenResult.username;
                        userinfo.des = authenResult.des;
                        userinfo.code = authenResult.code;
                        if (!(userinfo.userid === undefined) && (userinfo.userid > 0)) {
                            MyUtil.outputErrorInfo("app.ts", "connection", "authenResult == true");
                            oneUser = new Users_1.Users(thisServer, userinfo);
                            usersMap.set(thisServer, oneUser);
                            MyUtil.outputDebugInfo("app.ts", "HandleUserLoginRegister", "username:" + userinfo.username + ",userid:" + userinfo.userid);
                        }
                        else {
                            MyUtil.outputErrorInfo("app.ts", "connection", "authenResult == false");
                            MyUtil.outputErrorInfo("app.ts", "HandleUserLoginRegister", "username:" + userinfo.username + ",userid:" + userinfo.userid + ".errcode:" + userinfo.code + ",des:[" + userinfo.des + "]");
                            thisServer.terminate();
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    }
    catch (error) {
        MyUtil.outputErrorInfo("app.ts", "connection", "catch error.==严重的未知错误!!!");
        thisServer.terminate();
        throw new Error(error);
    }
    //TODO:不建议这里直接交给Users来处理，否则无法管理usersMap了，所以这里不是直接使用Users类的回调函数
    /** handle [close] Events */
    thisServer.on('close', function handleClose(code, reason) {
        var _a, _b;
        ////更新usersMap
        MyUtil.outputDebugInfo("app.ts", "close", "--------------");
        console.log("one user closed.username:" + ((_a = usersMap.get(thisServer)) === null || _a === void 0 ? void 0 : _a.getUserInfo().username));
        (_b = usersMap.get(thisServer)) === null || _b === void 0 ? void 0 : _b.handleClose(code, reason);
        usersMap.delete(thisServer);
    });
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------End");
});
server.listen(listenPort, function () {
    MyUtil.outputDebugInfo("app.ts", "this is serverApp.", "Server is running. listening port is:" + listenPort);
});
MyUtil.outputDebugInfo("app.ts", "this is serverApp.", "----------------End");
//# sourceMappingURL=app.js.map