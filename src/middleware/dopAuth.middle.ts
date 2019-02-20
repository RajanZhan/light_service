// 道普授权中间件
const expire = $config.dopApiExpire;// token的过期时间
// function getClientIP(req) {
//     return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
//         req.connection.remoteAddress || // 判断 connection 的远程 IP
//         req.socket.remoteAddress || // 判断后端的 socket 的 IP
//         req.connection.socket.remoteAddress;
// };

export default async (req, res, next) => {

    regGlobal("$req", req);
    regGlobal("$res", res);
    req.$ip = $common.getClientIP(req);
    var token = null;
    var name = null;
    if (req.method == 'GET') {
        token = req.query.authtoken;
        name = req.query.authname
    }
    else {
        token = req.body.authtoken;
        name = req.body.authname
    }
    //let ip = getClientIP(req);
    //console.log();
    let authInfo = await $commonCache.get(token);
    req.$dopAuth = authInfo;

    req.createDopAuthInfo = (info) => {
        let token = $common.getRandomString();
        $commonCache.set(<string>token, info, expire); // 十分钟的授权 
        return {
            token
        }
    }

    // 免授权的地址
    if (req.path.indexOf("/api/public") != -1) {
        //console.log("免授权");
        // if ($config.debug == 1)
        //     console.log("公共 path", req.path);
        return next();
    }

    // let noauth = new Set($config.noAuthPath);
    // if (noauth.has(<never>req.path)) {
    //     //console.log("免授权");
    //     return next();
    // }
    //console.log(noauth);

    if (req.path.indexOf('/api') == -1) {
        // if ($config.debug == 1) {
        //     console.log("非api path", req.path);
        // }
        return next();
    }

    //  调试模式 取用默认的 授权信息 
    if ($config.debug == 1) {
        req.$dopAuth = $config.debugAuth;
        //console.log("调试模式 验权");
        return next();
    }
    var path = $config.name + req.path;
    //console.log("path is ",path);

    //console.log("读取真是IP ", req.$ip);

    // 查看该请求path 是不是在需要授权的 列表中

    let auth = new Set($config.authPath);
    if (!auth.has(<never>req.path)) {
        if ($config.debug == 1) {
            console.log("免授权 path", req.path);
        }
        return next();
    }

    if (!$commonCache) {
        throw new Error("dopAuth error,$commonCache is undefined");
    }
    let methods = req.method;
    if (!methods) {
        throw new Error("授权中间件验证失败，methods 读取失败");
    }



    if (!token || !name) {
        //console.log(token,req.method);
        return res.deny("token or name is empty");
    }
    if (!authInfo) {
        return res.deny("get auth info  error");
    }
    if (!req.$ip) {
        return res.stop("client ip is empty");
    }

    if (!authInfo['ip'] || (authInfo['ip'] != req.$ip) || (authInfo['userInfo']['name'] != name)) {
        console.log(authInfo)
        return res.stop("auth  error");
    }
    //console.log("right info is", authInfo['userInfo']);
    let userRights = new Set(authInfo['userInfo']['allRight']);
    if (userRights.has("all")) {
        console.log('拥有最高权限');
        return next();
    }
    if (!userRights.has(path)) {
        return res.stop("您没有有限访问此API" + path);
    }

    $commonCache.expire(token, expire);
    //console.log("道普授权中间件，methods", req.$dopAuth);

    next();
}