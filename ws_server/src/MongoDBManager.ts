//fileName:MongoDBManager.ts
//Author:Henry
//Date:20200419
//File Description:读写mongoDB数据库

import mongoose from "mongoose"
import {Users} from './Users'
import * as NetMessageType from './NetMessageType'
import * as NetMessageID from './NetMessageID'
import * as MyUtil from './Util'


///操作用户表
class UserForm{
    username:string | undefined;
    password:string | undefined;
};


//每个表，都需要定义一个表结构.（目前，登陆和注册都是同一个表来处理的）
let UserListSchema = new mongoose.Schema({
    name:String,
    userid:Number,
    password:String,
    logTime: Date
});         
//表和结构关联
mongoose.model('UserList', UserListSchema);
//导出一个model.
let UserList = mongoose.model("UserList");



//每个表，都需要定义一个表结构
const LogoutSchema = new mongoose.Schema({
    name:String,
    userid:Number,
    password:String,
    logTime: Date
});         
//表和结构关联
mongoose.model('log_user_logout', LogoutSchema);
//导出一个model.
const LogUserlogout = mongoose.model("log_user_logout");



export class MongoDBManager
{
    mongoInfo:NetMessageType.MONGODB_INFO = <NetMessageType.MONGODB_INFO> {};
    mongoConnectSuccess:boolean;

    constructor(mongoInfo:NetMessageType.MONGODB_INFO)
    {
        this.mongoConnectSuccess=false;
        this.mongoInfo.url = mongoInfo.url;
        this.mongoInfo.dbName = mongoInfo.dbName;
        this.mongoInit();
    }

    private mongoInit()
    {
        //const uri = 'mongodb://localhost/Database0416';
        //mongodb://user:pass@localhost:port/database
        mongoose.connect(`${this.mongoInfo.url}/${this.mongoInfo.dbName}`,err =>{
            if(err)
            {
                MyUtil.outputErrorInfo("MongoDBManagers", "mongoInit", "mongoose connect failed.");
                console.log(err);
                return ;
            }

            this.mongoConnectSuccess=true;
            MyUtil.outputDebugInfo("MongoDBManagers", "mongoInit", "mongoose connect success...");
        })
    }

        // Events
    userRegister(regist:NetMessageType.MSG_REGISTER, listener: (code: number, reason?: string) => void  ){
        if(this.mongoConnectSuccess)
        {
            MyUtil.outputDebugInfo("MongoDBManager", "userRegister","handle register");         


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
            UserList.find({name:regist.username}, function(err, docs)
            {
                if(err)
                {
                    listener(NetMessageID.ERROR_CODE.REGISTER_FAILED,"注册失败，数据库有问题");
                    return ;
                }
                if(docs.length>0)
                {
                    listener(NetMessageID.ERROR_CODE.REGISTER_FAILED,"注册失败，账号已存在");
                }
                else
                {
                    let oneUser = new UserList({
                        name:regist.username,
                        userid:10086,////TODO:如何设置一个自增长的值
                        password:regist.password,
                        logTime:new Date()
                    });    
            
                    oneUser.save(function (err){
                        if(err)
                        {                            
                            listener(NetMessageID.ERROR_CODE.REGISTER_FAILED,"注册失败，保存数据库失败，未知错误");
                        }
                        else
                        {
                            MyUtil.outputDebugInfo("MongoDBManager.ts", "userRegister", `新玩家[${regist.username}]注册成功`);
                            listener(NetMessageID.ERROR_CODE.IS_OK,"注册成功");
                        }
                    });
                }
            });
        }
        else
        {
            MyUtil.outputErrorInfo("MongoDBManager", "userRegister","mongo connect lost");
        }
    };

    userLogin(login:NetMessageType.MSG_LOGIN, listener: (code: number, reason?: string) => void  ){
        if(this.mongoConnectSuccess)
        {
            MyUtil.outputDebugInfo("MongoDBManager", "userLogin","handle Login");

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
            UserList.find( {name: login.username}, function(err, docs:any)
            {
                if(err)
                {
                    listener(NetMessageID.ERROR_CODE.LOGIN_FAILED,"登陆失败，数据库有问题");
                    return ;
                }
                if(docs.length>0)
                {         
                    if(docs[0].password.match(login.password))
                    {
                        listener(NetMessageID.ERROR_CODE.IS_OK,"登陆成功");
                    }
                    else
                    {
                        listener(NetMessageID.ERROR_CODE.LOGIN_FAILED,"登陆失败，密码错误");
                    }
                }
                else
                {
                    listener(NetMessageID.ERROR_CODE.LOGIN_FAILED,"登陆失败，玩家信息不存在");
                }
            });
        }
        else
        {
            MyUtil.outputErrorInfo("MongoDBManager", "userLogin","mongo connect lost");
        }    
    };

    ///TODO:数据库可能会记录玩家退出信息..暂时不记录.
    userLogout(logout:NetMessageType.MSG_LOGOUT, listener: (code: number, reason?: string) => void  ){
        if(this.mongoConnectSuccess)
        {
            MyUtil.outputDebugInfo("MongoDBManager", "userLogout","handle logout");

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

            let oneUser = new LogUserlogout({
                name:logout.username,
                userid:100888,
                password:logout.password,
                logTime:new Date()
            });    
    
            oneUser.save(function (err){
                if(err)
                {                            
                    listener(NetMessageID.ERROR_CODE.LOGOUT_FAILED,"退出失败，保存数据库失败，未知错误");
                }
                else
                {
                    MyUtil.outputDebugInfo("MongoDBManager.ts", "userLogout", `新玩家[${logout.username}]退出了。`);
                    listener(NetMessageID.ERROR_CODE.IS_OK,"退出成功，数据库保存玩家记录");
                }
            });
        }
        else
        {
            MyUtil.outputErrorInfo("MongoDBManager", "userLogout","mongo connect lost");
        }    
    };
}