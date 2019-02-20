/** 微服务客户端 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const logger = console;
// 1. 创建 zk 注册中心客户端
const registry = new ZookeeperRegistry({
    logger,
    address: $config.msClient.zkHost,
});
// 2. 创建 RPC Client 实例
const client = new RpcClient({
    logger,
    registry,
});
exports.default = async (obj) => {
    try {
        // 3. 创建服务的 consumer
        const consumer = client.createConsumer({
            interfaceName: obj.interfaceName,
        });
        // 4. 等待 consumer ready（从注册中心订阅服务列表...）
        await consumer.ready();
        let params = obj.params ? obj.params : [undefined];
        params[1] = $req.$dopAuth;
        // 5. 执行泛化调用
        const result = await consumer.invoke(obj.actionName, params, { responseTimeout: 3000 });
        return result;
    }
    catch (err) {
        throw err;
    }
};
