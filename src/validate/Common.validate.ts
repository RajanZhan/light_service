// 通用检测方法
export default {

    // 检测手机号码格式
    async checkTelNum(value)
    {
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){ 
            
            return [false,'手机号码有误']; 
        } 
        return [true]
    },

    // 检测密码 和确认密码是否 一致欧
    async checkPwd(pwd,repwd)
    {
        if(pwd != repwd)
        {
            return [false,'两次密码不相等']
        }
        return [true]
    },

    // 检测手机验证码
    async checkSms(sms,smsid)
    {
        if(!smsid)
        {
            return [false,'smsid为空，无法验证手机验证码']
        }
        let cache =await $model("Sms.getSmsValue",smsid);
        if(!cache)
        {
            return [false,'验证码存档信息读取失败']
        }
        if(cache == sms){

            //验证通过 ，清空数据
            if($config.debug != 1)
            {
                 $model("Sms.delSms",smsid)
            }
            return [true]
        }
        return [false,'验证码不正确']
    }


}