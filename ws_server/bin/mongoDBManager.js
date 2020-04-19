"use strict";
//fileName:MongoDBManager.ts
//Author:Henry
//Date:20200419
//File Description:读写mongoDB数据库
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
var mongoose_1 = __importDefault(require("mongoose"));
var NetMessageID = __importStar(require("./NetMessageID"));
var MyUtil = __importStar(require("./Util"));
///操作用户表
var UserForm = /** @class */ (function () {
    function UserForm() {
    }
    return UserForm;
}());
;
//每个表，都需要定义一个表结构.（目前，登陆和注册都是同一个表来处理的）
var UserListSchema = new mongoose_1.default.Schema({
    name: String,
    userid: Number,
    password: String,
    logTime: Date
});
//表和结构关联
mongoose_1.default.model('UserList', UserListSchema);
//导出一个model.
var UserList = mongoose_1.default.model("UserList");
//每个表，都需要定义一个表结构
var LogoutSchema = new mongoose_1.default.Schema({
    name: String,
    userid: Number,
    password: String,
    logTime: Date
});
//表和结构关联
mongoose_1.default.model('log_user_logout', LogoutSchema);
//导出一个model.
var LogUserlogout = mongoose_1.default.model("log_user_logout");
var MongoDBManager = /** @class */ (function () {
    function MongoDBManager(mongoInfo) {
        this.mongoInfo = {};
        this.mongoConnectSuccess = false;
        this.mongoInfo.url = mongoInfo.url;
        this.mongoInfo.dbName = mongoInfo.dbName;
        this.mongoInit();
    }
    MongoDBManager.prototype.mongoInit = function () {
        var _this = this;
        //const uri = 'mongodb://localhost/Database0416';
        //mongodb://user:pass@localhost:port/database
        mongoose_1.default.connect(this.mongoInfo.url + "/" + this.mongoInfo.dbName, function (err) {
            if (err) {
                MyUtil.outputErrorInfo("MongoDBManagers", "mongoInit", "mongoose connect failed.");
                console.log(err);
                return;
            }
            _this.mongoConnectSuccess = true;
            MyUtil.outputDebugInfo("MongoDBManagers", "mongoInit", "mongoose connect success...");
        });
    };
    // Events
    MongoDBManager.prototype.userRegister = function (regist, listener) {
        if (this.mongoConnectSuccess) {
            MyUtil.outputDebugInfo("MongoDBManager", "userRegister", "handle register");
            // //定义一个表结构
            // let UserListSchema = new mongoose.Schema({
            //     name:String,
            //     userid:Number,
            //     password:String,
            //     logTime: Date
            // });         
            // //表和结构关联
            // mongoose.model('UserList', UserListSchema);
            // //导出一个model.
            // let UserList = mongoose.model("UserList");
            //查询数据库是否有该玩家
            UserList.find({ name: regist.username }, function (err, docs) {
                if (err) {
                    listener(NetMessageID.ERROR_CODE.REGISTER_FAILED, "注册失败，数据库有问题");
                    return;
                }
                if (docs.length > 0) {
                    listener(NetMessageID.ERROR_CODE.REGISTER_FAILED, "注册失败，账号已存在");
                }
                else {
                    var oneUser = new UserList({
                        name: regist.username,
                        userid: 10086,
                        password: regist.password,
                        logTime: new Date()
                    });
                    oneUser.save(function (err) {
                        if (err) {
                            listener(NetMessageID.ERROR_CODE.REGISTER_FAILED, "注册失败，保存数据库失败，未知错误");
                        }
                        else {
                            MyUtil.outputDebugInfo("MongoDBManager.ts", "userRegister", "\u65B0\u73A9\u5BB6[" + regist.username + "]\u6CE8\u518C\u6210\u529F");
                            listener(NetMessageID.ERROR_CODE.IS_OK, "注册成功");
                        }
                    });
                }
            });
        }
        else {
            MyUtil.outputErrorInfo("MongoDBManager", "userRegister", "mongo connect lost");
        }
    };
    ;
    MongoDBManager.prototype.userLogin = function (login, listener) {
        if (this.mongoConnectSuccess) {
            MyUtil.outputDebugInfo("MongoDBManager", "userLogin", "handle Login");
            // //定义一个表结构
            // const UserListSchema = new mongoose.Schema({
            //     name:String,
            //     userid:Number,
            //     password:String,
            //     logTime: Date
            // });         
            // //表和结构关联
            // mongoose.model('UserList', UserListSchema);
            // //导出一个model.
            // const UserList = mongoose.model("UserList");
            //查询数据库是否有该玩家            
            UserList.find({ name: login.username }, function (err, docs) {
                if (err) {
                    listener(NetMessageID.ERROR_CODE.LOGIN_FAILED, "登陆失败，数据库有问题");
                    return;
                }
                if (docs.length > 0) {
                    if (docs[0].password.match(login.password)) {
                        listener(NetMessageID.ERROR_CODE.IS_OK, "登陆成功");
                    }
                    else {
                        listener(NetMessageID.ERROR_CODE.LOGIN_FAILED, "登陆失败，密码错误");
                    }
                }
                else {
                    listener(NetMessageID.ERROR_CODE.LOGIN_FAILED, "登陆失败，玩家信息不存在");
                }
            });
        }
        else {
            MyUtil.outputErrorInfo("MongoDBManager", "userLogin", "mongo connect lost");
        }
    };
    ;
    ///TODO:数据库可能会记录玩家退出信息..暂时不记录.
    MongoDBManager.prototype.userLogout = function (logout, listener) {
        if (this.mongoConnectSuccess) {
            MyUtil.outputDebugInfo("MongoDBManager", "userLogout", "handle logout");
            // //定义一个表结构
            // const LogoutSchema = new mongoose.Schema({
            //     name:String,
            //     userid:Number,
            //     password:String,
            //     logTime: Date
            // });         
            // //表和结构关联
            // mongoose.model('log_user_logout', LogoutSchema);
            // //导出一个model.
            // const LogUserlogout = mongoose.model("log_user_logout");
            var oneUser = new LogUserlogout({
                name: logout.username,
                userid: 100888,
                password: logout.password,
                logTime: new Date()
            });
            oneUser.save(function (err) {
                if (err) {
                    listener(NetMessageID.ERROR_CODE.LOGOUT_FAILED, "退出失败，保存数据库失败，未知错误");
                }
                else {
                    MyUtil.outputDebugInfo("MongoDBManager.ts", "userLogout", "\u65B0\u73A9\u5BB6[" + logout.username + "]\u9000\u51FA\u4E86\u3002");
                    listener(NetMessageID.ERROR_CODE.IS_OK, "退出成功，数据库保存玩家记录");
                }
            });
        }
        else {
            MyUtil.outputErrorInfo("MongoDBManager", "userLogout", "mongo connect lost");
        }
    };
    ;
    return MongoDBManager;
}());
exports.MongoDBManager = MongoDBManager;
//# sourceMappingURL=MongoDBManager.js.map