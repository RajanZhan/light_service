import baseLogic from "../lib/Base.Logic.v1"

export default class extends baseLogic {
    
    constructor(obj: any) {
        super(obj);
    }

    /**
     * 用户登录
     * @param data  {tln, pwd}
     */
    async login(data)
    {
        // 合法数据校验
        await $dataChecker([
            {
                data: "tln", // 字段名
                require: true,// 是否为必传数值
                msg:"tln校验失败",// 验证错误时的提示信息
                dataType:"number",// 数据类型
                exParams:"",//附加参数
                handler:"Common@checkTelNum" // 调用验证的方法
            },
            {
                data: "pwd",
                require: true
            }
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let loginResult  = await $model("user.userPwdCheck",data);
        if(loginResult === true)
        {
            // 生成 token 
            return {
                token:$common.getRandomString(),
            }
        }
        
    }



    /**
     * 读取用户详情
     * @param data  {tln, pwd}
     */
    async get(data)
    {
        // 合法数据校验
        await $dataChecker([
            
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let userInfo  = await $model("user.getUserInfoById",data);
        return userInfo;
        
    }

    /**
     * 增加文章
     * 请验证 tel,pwd,repwd,type,的合法性
     * @param data  {tln, pwd}
     */
    async add(data)
    {
        // 合法数据校验
        await $dataChecker([
            
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let addResult  = await $model("user.add",data);
        return addResult;
        
    }


    /**
     * 列举指定主账号下的子账号列表
     * @param data  {id，fileds}
     */
    async subUser(data)
    {
        // 合法数据校验
        await $dataChecker([
            
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let result  = await $model("user.subUser",data);
        return result;
        
    }


    /**
     * 更改账号资料
     * @param data  {id，data}
     */
    async update(data)
    {
        // 合法数据校验
        await $dataChecker([
            
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let result  = await $model("user.update",data);
        return result;
        
    }
    
    /**
     * 删除指定账号
     * @param data  {id，data}
     */
    async delete(data)
    {
        // 合法数据校验
        await $dataChecker([
            
        ], data);

        // 调用user.Model 中的login方法 ，参数是data
        let result  = await $model("user.delete",data);
        return result;
        
    }


}