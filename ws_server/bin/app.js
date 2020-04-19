"use strict";
//fileName:app.ts
//Author:Henry
//Date:20200419
//File Description:程序启动入口（配置文件配置了app.ts启动）
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
MyUtil.outputDebugInfo("app.ts", "this is serverApp.", "----------------start");
var app = express_1.default();
var server = http_1.default.createServer(app);
////如何设置最大连接数？
var ws_server = new ws_1.default.Server({ server: server, maxPayload: 1024 });
var listenPort = 3006;
////定义玩家信息列表，存放所有玩家类  
//let userlist:Set<Users>;
var usersMap;
usersMap = new Map();
///通过mongoObj去 处理若干请求、设置若干数据等等
var mongoInfo = {};
mongoInfo.url = "mongodb://localhost";
mongoInfo.dbName = "Database0419";
var mongoObj = new MongoDBManager_1.MongoDBManager(mongoInfo);
////只在http访问的时候，会接收到消息
app.get('*', function (req, res) {
    MyUtil.outputDebugInfo("app.ts", "app.get", "get some info.");
    // console.dir(req);
    // console.dir(res);
    console.log(req);
    console.log(res);
    // console.log(res);
});
////handle connection
ws_server.on('connection', function handleConnection(thisServer, requestMsg) {
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------start");
    console.log("Total clients nums is:[%d]", this.clients.size);
    //1.create a user
    var oneUser = new Users_1.Users(thisServer, mongoObj);
    //2.add this user to usersMap
    usersMap.set(thisServer, oneUser);
    //====================handle [message]  
    thisServer.on('message', function handleIncoming(recvData) {
        var _a;
        MyUtil.outputDebugInfo("app.ts", "message", "message comming..........start");
        ////Users类处理接收的数据
        //        (<Users>usersMap.get(thisServer)).UserReceiveMsg(recvData);
        //TODO:在使用 usersMap前，需要做非空的判断
        (_a = usersMap.get(thisServer)) === null || _a === void 0 ? void 0 : _a.handleIncoming(recvData);
        MyUtil.outputDebugInfo("app.ts", "message", "message comming..........End");
    });
    //====================handle [error]
    thisServer.on('error', function handleError(error) {
        var _a;
        MyUtil.outputErrorInfo("app.ts", "error", "-------------->>>start");
        (_a = usersMap.get(thisServer)) === null || _a === void 0 ? void 0 : _a.handleError(error);
        console.dir(error);
        MyUtil.outputErrorInfo("app.ts", "error", "-------------->>>End");
    });
    //====================handle [close]
    thisServer.on('close', function handleClose(code, reason) {
        var _a, _b;
        ////更新usersMap
        MyUtil.outputDebugInfo("app.ts", "close", "--------------");
        console.log("one user closed.username:" + ((_a = usersMap.get(thisServer)) === null || _a === void 0 ? void 0 : _a.username));
        (_b = usersMap.get(thisServer)) === null || _b === void 0 ? void 0 : _b.handleClose(code, reason);
        usersMap.delete(thisServer);
    });
    MyUtil.outputDebugInfo("app.ts", "connection", "--------------[connection]-------------End");
});
server.listen(listenPort, function () {
    console.log("Server is running. listening port is:" + listenPort);
});
MyUtil.outputDebugInfo("app.ts", "this is serverApp.", "----------------End");
//# sourceMappingURL=app.js.map