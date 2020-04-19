"use strict";
//fileName:Util.ts
//Author:Henry
//Date:20200419
//File Description:定义一个工具方法
Object.defineProperty(exports, "__esModule", { value: true });
///TODO:description做成可变参数，可以格式化输出那种
function outputDebugInfo(fileName, functionName, description) {
    console.log(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputDebugInfo = outputDebugInfo;
function outputErrorInfo(fileName, functionName, description) {
    console.error(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputErrorInfo = outputErrorInfo;
function outputWarnInfo(fileName, functionName, description) {
    console.warn(new Date() + "[" + fileName + "]:[" + functionName + "]:" + description);
}
exports.outputWarnInfo = outputWarnInfo;
//# sourceMappingURL=Util.js.map