// 前端应用 登录token 验证中间件
export default async (req, res, next) => {
    req.$ip = $common.getClientIP(req);
    let token = "";
    if (req.method == 'GET') {
        token = req.query.viptoken;

    }
    else {
        token = req.body.viptoken;
    }

    if (!token) {
        console.log(token, req.query);
        return res.error("token 不能为空");
    }

    let ip = await $cache.get("vip-token-ip" + token)
    let reqid = req.$ip;
    if ($config.debug != 1) {
        if (ip != reqid) {
            console.log(ip, reqid, "ip 验证不通过");
            return res.error("token验证失败");
        }
    }
    //重新修改token的有效期
    $cache.expire(token, $config.vipToken.expire); // 五分钟有效

    next();
}