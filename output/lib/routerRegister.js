/** 路由注册器 
 * @param path 路由名称
 * @param rightName 权限名称
 * @param fn 处理方法
*/
var ppath = ""// 上一级api 
const express = require('express');
var router = null;
var appRight = [];

function get(path, rightName, fn) {

    router.get(path, fn);
    if(!appRight[ppath]) appRight[ppath] = []
    appRight[ppath].push({
        path: path,
        rightName: rightName
    })
    // 将应用程序的权限提取出来
    //regGlobal("$appRight", appRight)
}
function post(path, rightName, fn) {
    router.post(path, fn);
    //console.log("注册post",path,fn);
    if(!appRight[ppath]) appRight[ppath] = []
    appRight[ppath].push({
        path: path,
        rightName: rightName
    })
    // 将应用程序的权限提取出来
    //regGlobal("$appRight", appRight)
}

// 提起应用的权限
function getAppRight() {
    return appRight;
}

//exports.router = router

module.exports = (path)=>{
    //console.log("初始化router register");
    //appRight = [];
    router = express.Router()
    router.getAppRight = getAppRight
    ppath = path;
    return {
        get,
        router,
        post,
        getAppRight,
    }
}
