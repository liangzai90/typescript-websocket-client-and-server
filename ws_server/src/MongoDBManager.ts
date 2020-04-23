//fileName:MongoDBManager.ts
//Author:Henry
//Date:20200419
//File Description:读写mongoDB数据库
import { MongoClient } from 'mongodb'
import { Users } from './Users'
import * as NetMessageType from './NetMessageType'
import * as NetMessageID from './NetMessageID'
import * as MyUtil from './Util'
import WebSocket from 'ws'
import assert from 'assert'

const dbname = 'user_list_db'
const table_register = 'user_register'
const table_logout = 'user_logout'



/**定义MongoDBManager的单例，封装了对数据库的若干操作 */
export class MongoDBManager {
    /**存放MongoDB的若干连接信息，url, dbName */
    private static mongoInfo: NetMessageType.MONGODB_INFO = <NetMessageType.MONGODB_INFO>{};
    private constructor(mongoInfo: NetMessageType.MONGODB_INFO) { };
    /**最低的userid值，新玩家的userid都是在这个值后面递增 */
    private static g_BaseUserID: number = 10000;
    public static setMongoDBInfo(mongoInfo: NetMessageType.MONGODB_INFO) {
        MongoDBManager.mongoInfo.url = mongoInfo.url;
        MongoDBManager.mongoInfo.dbName = mongoInfo.dbName;
        MongoDBManager.mongoInit();
    }

    /**测试数据库连接是否OK */
    private static mongoInit() {
        MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
            if (err) {
                MyUtil.outputErrorInfo("MongoDBManagers", "mongoInit", "mongoose connect failed.");
                console.log(err);
                dbClient.close();
                return;
            }
            dbClient.close();
            MyUtil.outputDebugInfo("MongoDBManagers", "mongoInit", "mongoose connect success...");
        });
    }




    /**玩家注册，请求数据库 */
    static async userRegister(regist: NetMessageType.USER_LOGIN_PARMA) {

        MyUtil.outputDebugInfo("MongoDBManager", "userRegister", "handle register");
        /**我们要返回的数据. code:对应错误码; des:描述具体错误信息 */
        let objReturn = <NetMessageType.MSG_S2C_RSP_1>{};
        objReturn.userid = 0;
        objReturn.username = regist.username;

        return new Promise((resolve, reject) => {
            /**1.连接数据库服务器*/
            MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
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
                const UserDB = dbClient.db(dbname);
                /**3.连接数据库的某个表*/
                const registerCollection = UserDB.collection(table_register);

                /** 要保存到数据库的 数据内容*/
                let oneUser = <NetMessageType.TABLE_USER_REGISTER>{};
                oneUser.username = regist.username;
                oneUser.userid = 0; /**生成的userid */
                oneUser.password = regist.password;
                oneUser.timestamp = new Date();

                /**查找*/
                let findObj = { username: regist.username };

                (async () => {
                    let retFind = await registerCollection.find(findObj).toArray();
                    console.error(retFind);
                    if (retFind.length > 0) {
                        objReturn.code = NetMessageID.ERROR_CODE.REGISTER_FAILED;
                        objReturn.des = "注册失败，账号已存在";
                        resolve(objReturn);
                        dbClient.close();
                        return;
                    }
                    let retRecord = await registerCollection.findOneAndUpdate({ increase: 1 }, { $inc: { userid: 1 }, $set: { des: "This line record total num" } }, { "upsert": true, "returnOriginal": false });
                    /**取出了递增的id值，把玩家userid字段赋值*/
                    oneUser.userid = MongoDBManager.g_BaseUserID + retRecord.value.userid;

                    /**插入我们的新数据 */
                    let retInsert = await registerCollection.insertOne(oneUser);

                    /**如果一切正常，会走到这里.把userid值放入返回值，传递出去 */
                    objReturn.userid = oneUser.userid
                    objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
                    objReturn.des = "注册成功";
                    MyUtil.outputErrorInfo("MongoDBManager.ts", "userRegister", `新玩家[${regist.username}]注册成功,userid:${objReturn.userid}`);
                    resolve(objReturn);
                    dbClient.close();
                })().catch(error=>{console.error(error);});
            })
        })
    };




    /**玩家登陆，请求数据库 */
    static async userLogin(login: NetMessageType.USER_LOGIN_PARMA) {
        MyUtil.outputDebugInfo("MongoDBManager", "userLogin", "handle login");
        /**我们要返回的数据. code:对应错误码; des:描述具体错误信息 */
        let objReturn = <NetMessageType.MSG_S2C_RSP_1>{};
        objReturn.userid = 0;
        objReturn.username = login.username;

        return new Promise((resolve, reject) => {
            /**1.连接数据库服务器*/
            MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
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
                const UserDB = dbClient.db(dbname);
                /**3.连接数据库的某个表*/
                const registerCollection = UserDB.collection(table_register);
                /**查找*/
                let findObj = { username: login.username };

                (async ()=>{
                    let retFind = await registerCollection.find(findObj).toArray();
                    if (retFind.length > 0) {
                        if (retFind[0].password.match(login.password)) {
                            objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
                            objReturn.des = "登陆成功";
                            objReturn.userid = retFind[0].userid;
                            resolve(objReturn);
                            dbClient.close();
                            MyUtil.outputErrorInfo("MongoDBManager.ts", "userLogin", `玩家[${login.username}]登陆成功,userid[${objReturn.userid}]`);
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
                })().catch(error=>{console.error(error)});
            })
        }).catch(error => console.error(error));  //如果查找失败，状态可能会卡在这，需要catch error;
    }





    ///TODO:数据库可能会记录玩家退出信息
    /**玩家退出，记录信息到数据库 */
    static async userLogout(logout: NetMessageType.MSG_S2C_RSP_1) {
        MyUtil.outputDebugInfo("MongoDBManager", "userLogout", `handle [${logout.username}]logout`);
        /**我们要返回的数据. code:对应错误码; des:描述具体错误信息 */
        let objReturn = <NetMessageType.MSG_S2C_RSP_1>{};
        objReturn.userid = 0;
        objReturn.username = logout.username;

        return new Promise((resolve, reject) => {
            /**1.连接数据库服务器*/
            MongoClient.connect(MongoDBManager.mongoInfo.url, function (err, dbClient) {
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
                const UserDB = dbClient.db(dbname);
                /**3.连接数据库的某个表*/
                const logoutCollection = UserDB.collection(table_logout);
                let oneUser = <NetMessageType.TABLE_USER_LOGOUT>{};
                oneUser.username = logout.username;
                oneUser.userid = logout.userid;
                oneUser.timestamp = new Date();
                oneUser.des = logout.des;


                logoutCollection.insertOne(oneUser, (err, res) => {
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
                    MyUtil.outputErrorInfo("MongoDBManager.ts", "userLogout", `玩家[${logout.username}]退出了。userid:${logout.userid}`);
                    resolve(objReturn);
                    dbClient.close();
                });
            })
        })
    };
}





