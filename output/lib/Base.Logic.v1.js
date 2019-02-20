"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 逻辑层 基础类
 *
 * */
class default_1 {
    constructor(authInfo) {
        this.authInfo = authInfo.$dopAuth;
        this.reqInfo = authInfo; // 设置请求的数据
    }
    // 读取授权信息
    getAuthInfo() {
        return this.authInfo;
    }
    setAuthInfo(authInfo) {
        this.authInfo = authInfo;
    }
    //读取req info 
    getReq() {
        return this.reqInfo;
    }
}
exports.default = default_1;
