//fileName:Authen.ts
//Author:Henry
//Date:20200420
//File Description:处理玩家认证、注册请求

import WebSocket from 'ws'
import * as NetMessageType from './NetMessageType';
import * as NetMessageID from './NetMessageID';
import * as MyUtil from './Util'
import {MongoDBManager} from './MongoDBManager'



export class Authen{
    private constructor(){
    }
    //
    static async HandleUserLoginRegister(userParmas:NetMessageType.USER_LOGIN_PARMA, thisServer:WebSocket){
        MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister","handle register and login");        

        /**处理用户注册 */
        if(NetMessageID.MESSAGE_SUB_ID.REGISTER == userParmas.act){

            /**需要强制转换，转换类型   (<NetMessageType.MSG_S2C_RSP_1>retValue)  ，也需要catch 异常   */
            let retValue = await MongoDBManager.userRegister(userParmas);   

            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister",`---register---userid:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).userid}],username:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).username}],code:${(<NetMessageType.MSG_S2C_RSP_1>retValue).code},des:${(<NetMessageType.MSG_S2C_RSP_1>retValue).des}`);        
            
            /**把登陆/注册的反馈数据发给客户端.s2c ，不需要同步， */
            Authen.registerRsp_s(thisServer,(<NetMessageType.MSG_S2C_RSP_1>retValue));

            if(NetMessageID.ERROR_CODE.IS_OK == (<NetMessageType.MSG_S2C_RSP_1>retValue).code){
                MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister",`Register success. username:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).username}],`);                
            }
            else {
                MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister","Register failed");     

            }  

            return retValue;//userid >0 ，且不为空，则判断玩家存在
        }

        /**处理用户登陆 */
        else if(NetMessageID.MESSAGE_SUB_ID.LOGIN == userParmas.act){
            /**需要强制转换，转换类型   (<NetMessageType.MSG_S2C_RSP_1>retValue)  ，也需要catch 异常   */
            let retValue = await MongoDBManager.userLogin(userParmas);   

            MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister",`---login---userid:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).userid}],username:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).username}],code:${(<NetMessageType.MSG_S2C_RSP_1>retValue).code},des:${(<NetMessageType.MSG_S2C_RSP_1>retValue).des}`);        
            
            /**把登陆/注册的反馈数据发给客户端.s2c ，不需要同步， */
            // let retValue2 =  await Authen.loginRsp_s(thisServer,(<NetMessageType.MSG_S2C_RSP_1>retValue) );
            Authen.loginRsp_s(thisServer,(<NetMessageType.MSG_S2C_RSP_1>retValue));

            if(NetMessageID.ERROR_CODE.IS_OK == (<NetMessageType.MSG_S2C_RSP_1>retValue).code){
                MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister",`Login success. username:[${(<NetMessageType.MSG_S2C_RSP_1>retValue).username}],`);                
            }
            else {
                MyUtil.outputDebugInfo("Authen", "HandleUserLoginRegister","bLoginRegisterSuccess == false");     
            }  

            return retValue;//userid >0 ，且不为空，则判断玩家存在
        }
        else{
            MyUtil.outputErrorInfo("Authen", "HandleUserLoginRegister",`user[${userParmas.username}] other act`);
            console.error(userParmas); 
            let tempRet = <NetMessageType.MSG_S2C_RSP_1>{};
            return tempRet;
        }
    };
    

    /**服务器给客户端注册反馈*/
    static registerRsp_s(thisServer:WebSocket,retVal:NetMessageType.MSG_S2C_RSP_1){
        return new Promise((resolve, reject)=>{
            MyUtil.outputDebugInfo("Authen", "registerRsp"," success.");
            let tempSendMsg = <NetMessageType.MSG_TYPE>{};
            tempSendMsg.msgTimeStamp = new Date();
            tempSendMsg.msgLength = 1;
            tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
            tempSendMsg.msgSubID =NetMessageID.MESSAGE_SUB_ID.REGISTER;
            let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{};
            tempDataSend2.code = retVal.code;
            tempDataSend2.des= retVal.des;
            tempDataSend2.userid= retVal.userid;
            tempDataSend2.username = retVal.username;            
            tempSendMsg.msgData = JSON.stringify(tempDataSend2);
            thisServer.send(JSON.stringify(tempSendMsg));
            resolve("registerRsp_s success");    
        });
    };


    /**服务器给客户端登陆反馈*/
    static async loginRsp_s(thisServer:WebSocket,retVal:NetMessageType.MSG_S2C_RSP_1){
        return new Promise((resolve, reject)=>{
            MyUtil.outputDebugInfo("Authen", "loginRsp"," success.");
            let tempSendMsg = <NetMessageType.MSG_TYPE>{};
            tempSendMsg.msgTimeStamp = new Date();
            tempSendMsg.msgLength = 1;
            tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
            tempSendMsg.msgSubID =NetMessageID.MESSAGE_SUB_ID.LOGIN;
            let tempDataSend2 = <NetMessageType.MSG_S2C_RSP_1>{};
            tempDataSend2.code = retVal.code;
            tempDataSend2.des= retVal.des;
            tempDataSend2.userid= retVal.userid;
            tempDataSend2.username = retVal.username;  
            tempSendMsg.msgData = JSON.stringify(tempDataSend2);
            thisServer.send(JSON.stringify(tempSendMsg));
            resolve("loginRsp_s success");     
        });
        };
}
