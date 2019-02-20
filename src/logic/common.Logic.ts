import baseLogic from "../lib/Base.Logic.v1"

interface sysUserLogin {
    name:string,
    type:string,
    pwd:string,
}

export default class extends baseLogic {
    constructor(obj: any) {
        super(obj);
    }

    // 平台级账户登录
    async sysUserLogin(data:sysUserLogin) {
       
        let res = <any> await $mdl("sysUser.getSysUserByName",this,data);
        if (!res) {
            throw new Error("用户可能不存在");
        }
        if (res.pwd != $common.md5(data.pwd + "dop_pwd")) {
            throw new Error("密码不正确");
        }
        return res;
    }

    

}