"use strict";
//fileName:Util.ts
//Author:Henry
//Date:20200419
//File Description:定义一个工具方法
Object.defineProperty(exports, "__esModule", { value: true });
// TODO:description做成可变参数，可以格式化输出那种
/**打印输出调试日志信息，文件名、函数名、描述信息*/
function outputDebugInfo(fileName, functionName, description) {
    console.log(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputDebugInfo = outputDebugInfo;
/**打印输出警告日志信息，文件名、函数名、描述信息*/
function outputErrorInfo(fileName, functionName, description) {
    console.error(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputErrorInfo = outputErrorInfo;
/**打印输出【错误】日志信息，文件名、函数名、描述信息*/
function outputWarnInfo(fileName, functionName, description) {
    console.warn(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputWarnInfo = outputWarnInfo;
//username=henry&pwd=12345&token=666
/**将用户登录时候的url里面的参数转为一个对象，方便读取 */
function urlToJsonObject(url) {
    var _a;
    var params = url === null || url === void 0 ? void 0 : url.split('?')[1];
    var objMap;
    objMap = new Map;
    try {
        var arr = params === null || params === void 0 ? void 0 : params.split('&');
        for (var i = 0; i < arr.length; i++) {
            var subArr = (_a = arr[i]) === null || _a === void 0 ? void 0 : _a.split('=');
            var key = decodeURIComponent(subArr[0]);
            var value = decodeURIComponent(subArr[1]);
            objMap.set(key, value);
        }
        console.log(objMap);
    }
    catch (error) {
        outputErrorInfo("Utils.ts", "urlToJsonObject", "translate url to json error");
        console.error("Invalid url: " + url);
        console.error(error);
    }
    return objMap;
}
exports.urlToJsonObject = urlToJsonObject;
//# sourceMappingURL=Util.js.map