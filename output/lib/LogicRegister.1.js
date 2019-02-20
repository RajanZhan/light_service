"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 注册逻辑层方法到系统常量*/
var logic = new Map();
// var global = {$lg:{}}
exports.default = () => {
    const fs = require("fs");
    const path = require("path");
    let logics = fs.readdirSync("./logic");
    // for (let l of logics) {
    //     let stat = fs.statSync("./logic/" + l);
    //     if (stat.isFile()) {
    //         let content = require("../logic/" + l);
    //         if (content.default) {
    //             let interfaceName = `${path.basename(l, ".js")}`;
    //             let instance = content.default;
    //             logic.set(interfaceName,instance)
    //             //console.log("instance ",instance);
    //             // for(let i in instance)
    //             // {
    //             //     let lname = `${path.basename(l, ".js")}.${i}`;
    //             //     logic.set(lname,instance[i])
    //             // }
    //         }
    //     }
    // }
    if (!$build.logic) {
        return;
    }
    for (let l in $build.logic) {
        let interfaceName = `${l}`;
        let instance = $build.logic[l].default;
        logic.set(interfaceName, instance);
        //console.log(interfaceName,instance);
    }
    //global.$lg = logic;
    regGlobal('$lg', (name, params) => {
        if (!name)
            throw new Error("无法调用逻辑，因为name为空");
        let arr = name.split('.');
        if (!arr[0] || !arr[1]) {
            throw new Error("无法调用逻辑，因为name格式不正确");
        }
        let lg = logic.get(`${arr[0]}.Logic`);
        //console.log(logic,`${arr[0]}.Logic`);
        if (!lg)
            throw new Error(`逻辑对象 ${lg} 不存在`);
        lg.setAuthInfo($req.$dopAuth);
        let fn = lg[arr[1]];
        if (!fn)
            throw new Error(`逻辑方法 ${arr[1]} 不存在`);
        return fn(params);
    });
    console.log("逻辑层注册");
};
