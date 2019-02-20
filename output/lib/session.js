
module.exports = async (req, res, next) => {
    //console.log("before redis in session");
    const redis = await require("./redis")();
    //console.log("get redis in session");
    var sid = "";
    if (!req.cookies.sid) {
        console.log("common",$common);
        sid = $common.getRandomString();
        //console.log("set cookie ...");
    } else {
        sid = req.cookies.sid
        //console.log("update cookie ...");
    }
    req._sid = sid;
    res._sid = sid;
    res.cookie('sid', sid, {
        expires: new Date(Date.now() + (parseInt($config.cookie.expire) * 1000)),
        httpOnly: true
    });
    // 在redis 中更新对应的缓存
    let keys = await redis.keysSync(`${req.cookies.sid}*`);
    for (let key of keys) {
        await redis.expireSync(key, parseInt($config.cookie.expire));
    }
    req.getSkey = (key) => {
        if (!key) throw "session.js getSkey error,key can not be empty";
        return `${req._sid}-${key}`;
    }
    // 设置session方法
    req.sessionSync = async (key, value) => {
        if (!req._sid) {
            throw "sessionSync error ,sid is empty";
        }
        key = req.getSkey(key);
        if (!key) throw "session.js session key can not be empty ";
        if (value == undefined) return await redis.getSync(key);
        return await redis.setexSync(key, $config.cookie.expire, value);
    }
    req.session = async (key, value) => {
        if (!req._sid) {
            throw "sessionSync error ,sid is empty";
        }
        key = req.getSkey(key);
        if (!key) throw "session.js session key can not be empty ";
        console.log("sesson key is ",key);
        if (value == undefined) return await redis.getSync(key);
        
        return await redis.setexSync(key, $config.cookie.expire, value);
    }
    req.delSessionSync = async (key) => {
        key = key = req.getSkey(key);
        return await redis.deleteSync(key);
    };
    
    req.dsession = async (key) => {
        key = key = req.getSkey(key);
        return await redis.deleteSync(key);
    };
    req.clearSessionSync = async () => {        
        let keys = await redis.keysSync(`${req._sid}*`);
        for (let key of keys) {
            await  redis.deleteSync(key);
        }
    };
    req.csession = async () => {        
        let keys = await redis.keysSync(`${req._sid}*`);
        for (let key of keys) {
            await  redis.deleteSync(key);
        }
    };


    next();
}