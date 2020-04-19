//fileName:Util.ts
//Author:Henry
//Date:20200419
//File Description:定义一个工具方法

///TODO:description做成可变参数，可以格式化输出那种
export function outputDebugInfo(fileName?:string, functionName?:string, description?:string )
{
    console.log(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}


export function outputErrorInfo(fileName?:string, functionName?:string, description?:string )
{
    console.error(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}


export function outputWarnInfo(fileName?:string, functionName?:string, description?:string )
{
    console.warn(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}


