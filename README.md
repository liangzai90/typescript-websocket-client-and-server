# typescript websocket-client and websocket-server.
	用TypeScript写的一个服务端和客户端。
	可以实现客户端的登陆、注册功能。服务器连接的是Mongoodb。
	
下载了工程之后，先运行 npm install ，把相关依赖的包安装好。



如果还缺少了哪些包或者环境没有配置好，请参考下面这些步骤。

https://www.cnblogs.com/music-liang/p/12708443.html

https://www.jianshu.com/p/0e37a793ac3a
https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html
https://typescript.bootcss.com/tsconfig-json.html

 



1.typescript开发的准备工作：
---------------------------------------
npm i -g typescript
npm i -g nodemon
npm install typings --global


2.typescript里面找不到 'http'模块
npm install -s http   
npm install -s @types/http
npm install --save @types/core-js
npm install --save-dev @types/node



===============================
1.初始tsc环境，生成tsconfig.json文件
  tsc  --init 
2.初始化 npm环境，生成package.json文件
  npm init -y
3.vs打开当前目录
  code . 
4.写完ts文件之后，记得build（构建）一下
5.打开watch功能
[Terminal]-->[Run Task],选择 watch 
  

win10 脚本被禁用问题：
------------------------------------------------
set-ExecutionPolicy RemoteSigned  
在power shell输入这个命令。
参考地址：https://blog.csdn.net/wqnmlgbsz/article/details/100654258






npm i -g typescript
npm install typings --global

npm install -s http   
npm install -s express 
npm install -s express-ws 
npm install -s mongodb
npm i -g nodemon

npm install -s @types/http
npm install -s @types/core-js
npm install -s -dev @types/node
npm install -s @types/express 
npm install -s @types/express-ws 
npm install -s @types/mongoose


 
 