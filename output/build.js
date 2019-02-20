
                "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 编译文件 配置 */
exports.default = {
    model:{
                            "commonBase.Model": require("./model/commonBase.Model"),
                            
                            "sysUser.Model": require("./model/sysUser.Model"),
                            },logic:{
                            "common.Logic": require("./logic/common.Logic"),
                            
                            "user.Logic": require("./logic/user.Logic"),
                            },
};