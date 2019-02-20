"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 微服务注册 */
const logicMap = new Map();
//拦截器
function Checker(action, instance) {
    return async (params, authInfo) => {
        //console.log("拦截到的信息",params,authInfo);
        instance.setAuthInfo(authInfo);
        //action.prototype = instance;
        return await action(params);
    };
}
exports.default = () => {
    const { RpcServer } = require('sofa-rpc-node').server;
    const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
    const logger = console;
    const fs = require("fs");
    const path = require("path");
    // 1. 创建 zk 注册中心客户端
    const registry = new ZookeeperRegistry({
        logger,
        address: $config.msServer.zkHost,
    });
    // 2. 创建 RPC Server 实例
    const server = new RpcServer({
        logger,
        registry,
        //port: Number($config.msServer.msPort)+ ( Number(Math.random().toFixed(3)) * 1000) ,
        port: Number($config.msServer.msPort),
    });
    let logics = fs.readdirSync("./logic");
    for (let l of logics) {
        let stat = fs.statSync("./logic/" + l);
        if (stat.isFile()) {
            let content = require("../logic/" + l);
            if (content.default) {
                let interfaceName = `${$config.name}.${path.basename(l, ".js")}`;
                let instance = content.default;
                //console.log("instance ",instance);
                for (let i in instance) {
                    let ms = {};
                    ms[i] = Checker(content.default[i], instance);
                    server.addService({
                        interfaceName: interfaceName,
                    }, ms);
                    console.log("注册微服务服务...", $config.name + "." + path.basename(l, ".js"), i);
                }
            }
        }
    }
    server.start()
        .then(() => {
        server.publish();
    });
};
