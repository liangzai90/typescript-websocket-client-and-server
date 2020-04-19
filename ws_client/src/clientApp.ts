import * as NetMessageType from './NetMessageType'
import * as NetMessageID from './NetMessageID'
import * as MyUtil from './Util'
////client ask server
import WebSocket from 'ws'

MyUtil.outputDebugInfo("app.ts", "this is clientApp.","---------------->>>>start");

const listenPort = 3006;
const ws_cient = new WebSocket(`ws://127.0.0.1:${listenPort}`);


// onerror: (event: WebSocket.ErrorEvent) => void;
// interface ErrorEvent {
//     error: any;
//     message: string;
//     type: string;
//     target: WebSocket;
// }



// onopen: (event: WebSocket.OpenEvent) => void;
// interface OpenEvent {
//     target: WebSocket;
// }
ws_cient.onopen = event =>{
    console.log(`Websocket 连接状态： ${event.target.readyState}`);
}



//// onmessage: (event: WebSocket.MessageEvent) => void;
// interface MessageEvent {
//     data: Data;
//     type: string;
//     target: WebSocket;
// }
//====================== S2C message ======================
ws_cient.onmessage = event =>{
    console.log("ws.onmessage----->>>服务器发来消息：");

    //1.解析服务器发来的消息
    let objData1:NetMessageType.MSG_TYPE = JSON.parse(<string>event.data);  ///强制类型转换<string>
    console.log("objData1:");
    console.dir(objData1);
    //2.根据 msgMainID，msgSubID，来处理不同消息
    if(NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER == objData1.msgMainID)
    {
        //handle login,register,logout response message...
        if(NetMessageID.MESSAGE_SUB_ID.REGISTER == objData1.msgSubID)
        {
            //TODO:1.msgData为undefine,
            //TODO:2.msgData不是合法json结构
            //TODO:3.msgData是空{}
            //TODO:4.msgData从json解析出来的object，没有我们需要的 字段名
            let objData2:NetMessageType.MSG_S2C_RSP_1 = JSON.parse(<string>objData1.msgData);
            if(0 != Object.keys(objData2).length)
            {                   
                if(NetMessageID.ERROR_CODE.IS_OK == objData2.code)
                {
                    MyUtil.outputDebugInfo("clientApp.ts", "REGISTER", `${objData2.code}`);   
                }
                else 
                {
                    MyUtil.outputErrorInfo("clientApp.ts", "REGISTER", `${objData2.code}`); ////这里不会执行，但是仍然保留.  
                }
            }
            else
            {
                MyUtil.outputErrorInfo("clientApp.ts", "REGISTER", `${objData2.code}`);   
            }
        }
        else  if(NetMessageID.MESSAGE_SUB_ID.LOGIN == objData1.msgSubID)
        {
            let objData2:NetMessageType.MSG_S2C_RSP_1 = JSON.parse(<string>objData1.msgData);
            if(0 != Object.keys(objData2).length)
            {                   
                if(NetMessageID.ERROR_CODE.IS_OK == objData2.code)
                {
                    MyUtil.outputDebugInfo("clientApp.ts", "LOGIN", `${objData2.code}`);   
                }
                else 
                {
                    MyUtil.outputErrorInfo("clientApp.ts", "LOGIN", `${objData2.code}`);   
                }
            }
            else
            {
                MyUtil.outputErrorInfo("clientApp.ts", "LOGIN", `${objData2.code}`);   
            }
            
        }
        else  if(NetMessageID.MESSAGE_SUB_ID.LOGOUT == objData1.msgSubID)
        {
            let objData2:NetMessageType.MSG_S2C_RSP_1 = JSON.parse(<string>objData1.msgData);
            if(0 != Object.keys(objData2).length)
            {                   
                if(NetMessageID.ERROR_CODE.IS_OK == objData2.code)
                {
                    MyUtil.outputDebugInfo("clientApp.ts", "LOGOUT", `${objData2.code}`);   
                }
                else 
                {
                    MyUtil.outputErrorInfo("clientApp.ts", "LOGOUT", `${objData2.code}`);   
                }
            }
            else
            {
                MyUtil.outputErrorInfo("clientApp.ts", "LOGOUT", `${objData2.code}`);   
            }
        }
        else
        {
            MyUtil.outputWarnInfo("clientApp.ts", "unknown message",`messageSubID:${objData1.msgSubID}`);   
        }
    }
    else if(NetMessageID.MESSAGE_MAIN_ID.ERROR_CODE == objData1.msgMainID)
    {
        MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", `messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID}`);   
        let objData2:NetMessageType.MSG_ERROR = JSON.parse(<string>objData1.msgData);;

        if(NetMessageID.ERROR_CODE.REGISTER_FAILED ==objData2.code)
        {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", `REGISTER_FAILED,messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID},des:${objData2.des}`);   
        }
        else if(NetMessageID.ERROR_CODE.LOGIN_FAILED ==objData2.code)
        {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", `LOGIN_FAILED,messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID},des:${objData2.des}`);   
        }
        else if(NetMessageID.ERROR_CODE.LOGOUT_FAILED ==objData2.code)
        {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", `LOGOUT_FAILED,messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID},des:${objData2.des}`);   
        }
        else 
        {
            MyUtil.outputErrorInfo("clientApp.ts", "ERROR_CODE", `[unknown],messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID},des:${objData2.des}`);   
        }
    }
    else 
    {
        MyUtil.outputWarnInfo("clientApp.ts", "unknown message",`messageMainID:${objData1.msgMainID},messageSubID:${objData1.msgSubID}`);   
    }
};





// onclose: (event: WebSocket.CloseEvent) => void;
// interface CloseEvent {
//     wasClean: boolean;
//     code: number;
//     reason: string;
//     target: WebSocket;
// }
ws_cient.onclose = event =>{
    console.log("ws.onclose------->>>WebSocket连接关闭");
    console.log(event.wasClean);
    console.log(event.code);
    console.log(event.reason);
    console.log(event.target);
}



function testRegister()
{
    let tempSendMsg = <NetMessageType.MSG_TYPE>{};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.REGISTER;
    let tempDataSend = <NetMessageType.MSG_REGISTER>{};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";

    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))

    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testRegister", "one client [Register]");
}



function testLogin()
{
    let tempSendMsg = <NetMessageType.MSG_TYPE>{};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGIN;
    let tempDataSend = <NetMessageType.MSG_LOGIN>{};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";

    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))

    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testLogin", "one client [Login]");
}



function testLogout()
{
    let tempSendMsg = <NetMessageType.MSG_TYPE>{};
    tempSendMsg.msgTimeStamp = new Date();
    tempSendMsg.msgLength = 1;
    tempSendMsg.msgMainID = NetMessageID.MESSAGE_MAIN_ID.MAIN_ID_LOGIN_REGISTER;
    tempSendMsg.msgSubID = NetMessageID.MESSAGE_SUB_ID.LOGOUT;
    let tempDataSend = <NetMessageType.MSG_LOGOUT>{};
    tempDataSend.username = "henry01";
    tempDataSend.password = "12345";

    ////将用户自定义的json数据，从obj转为json字符串，然后打包发送出去
    tempSendMsg.msgData = JSON.stringify(tempDataSend);
    //console.log(JSON.stringify(tempSendMsg))

    ///obj转为json字符串，发送给客户端
    ws_cient.send(JSON.stringify(tempSendMsg));
    MyUtil.outputDebugInfo("clientApp.ts", "testLogout", "one client [Logout]]");
}



////客户端定时向服务器发消息.
let tempClock = 1;
let interval = setInterval(function () {

    if(ws_cient.readyState == ws_cient.OPEN)
    {
        /////==============================模拟发送一条信息给服务器

//        testRegister();

        testLogin();

//        testLogout();

        console.log(`[setInterval]-----check----[${tempClock}]`);    
        tempClock++;
    }
    else
    {
        clearInterval(interval);
    }
}, 3000);










MyUtil.outputDebugInfo("app.ts", "this is clientApp.","---------------->>>>End");

