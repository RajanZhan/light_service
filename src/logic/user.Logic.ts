import baseLogic from "../lib/Base.Logic.v1"
export default class extends baseLogic {
    constructor(obj: any) {
        super(obj);
    }

    // 读取平台级账户的数据
    async getSysUserByName(data) {
        try {
            console.log("user.getSysUserByName 逻辑层被调用...");
            await $dataChecker([
                {
                    data: "name",
                    require: true,
                },
                {
                    data: "type",
                    require: true
                }
            ], data);
            //return "hahahah"
            let res =  await $mdl("sysUser.getSysUserByName", this, data);
            console.log("结果为",res);
            return res;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

}