//fileName:Util.ts
//Author:Henry
//Date:20200419
//File Description:定义一个工具方法

// TODO:description做成可变参数，可以格式化输出那种
/**打印输出调试日志信息，文件名、函数名、描述信息*/
export function outputDebugInfo(fileName?:string, functionName?:string, description?:string ){
    console.log(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}

/**打印输出警告日志信息，文件名、函数名、描述信息*/
export function outputErrorInfo(fileName?:string, functionName?:string, description?:string ){
    console.error(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}

/**打印输出【错误】日志信息，文件名、函数名、描述信息*/
export function outputWarnInfo(fileName?:string, functionName?:string, description?:string ){
    console.warn(`${new Date()}[${fileName}]:[${functionName}]:${description}`);
}

//username=henry&pwd=12345&token=666
/**将用户登录时候的url里面的参数转为一个对象，方便读取 */
export function urlToJsonObject(url:string):Map<string,string>{
    let params = url?.split('?')[1];

    let objMap:Map<string,string>;
    objMap = new Map;

    try{
        let arr = params?.split('&');
        for(let i=0; i<arr.length; i++)
        {
            let subArr = arr[i]?.split('=');
            let key = decodeURIComponent(subArr[0]);
            let value = decodeURIComponent(subArr[1]);
            objMap.set(key,value);            
        }

        console.log(objMap);
    }
    catch(error)    {
        outputErrorInfo("Utils.ts", "urlToJsonObject", "translate url to json error");
        console.error("Invalid url: " + url);
        console.error(error);
    }

    return objMap;
}
