module.exports = async () => {
    const fs = require("fs");
    const jsonmini = require("jsonminify");
    const express = require('express');
    const app = express();
    const path = require("path");
    
    let sysConfig = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
    if (fs.existsSync(path.join(__dirname, "./app.config.json"))) {
        let appConfig = JSON.parse(jsonmini(fs.readFileSync("./app.config.json").toString()));
        for (let c in appConfig) {
            sysConfig[c] = appConfig[c];
        }
    }

    // 读取微服务的配置文件
    let configpath = path.join(__dirname, "./ms.config.json")
    if(fs.existsSync(configpath))
    {
        let appConfig = JSON.parse(jsonmini(fs.readFileSync(configpath).toString()));
        for (let c in appConfig) {
            sysConfig[c] = appConfig[c];
        }        
    }

    // 数据库配置文件
     configpath = path.join(__dirname, "./db.config.json")
    if(fs.existsSync(configpath))
    {
        let appConfig = JSON.parse(jsonmini(fs.readFileSync(configpath).toString()));
        for (let c in appConfig) {
            sysConfig[c] = appConfig[c];
        }        
    }
    // redis配置文件
     configpath = path.join(__dirname, "./redis.config.json")
    if(fs.existsSync(configpath))
    {
        let appConfig = JSON.parse(jsonmini(fs.readFileSync(configpath).toString()));
        for (let c in appConfig) {
            sysConfig[c] = appConfig[c];
        }        
    }

    // 核心库的路径
    // const corePath = path.join(__dirname,$config.corePath);
    // global.$corePath = corePath;


    global.$config = sysConfig;
    const template = require('art-template');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const middleware = require("./common/middleWare");
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    const logger = require("./lib/logger");
    const error = require("./lib/error");
    const http = require("http");
    
    // 注册全局对象，方法
    global.regGlobal = (name,obj)=>{
        global[name] = obj
    }
    global.$tp = template;
    global.$logger = logger;
    global.$error = error;
    global.$common = require("./common/utils").default;
    global.$db = await require("./common/db")(); // 初始化数据库
    global.$cache = await require("./lib/cache")(); // 初始化缓存
    global.$commonCache = await require("./lib/commonCache")(); // 初始化缓存
    global.$validate = require("./lib/validate.core");
    global.$logic = require("./lib/validate.core.v1").default; // 数据 逻辑验证
    global.$dataChecker = require("./lib/validate.core.v1").default; // 新版本的数据逻辑验证
    global.$rootPath = __dirname; // 系统的根路径
    if ($config.cross == 1) {
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Token,Appid,AppId");
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
            next();
            //console.log("跨域处理hahah");
        });
    }
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000
    }));
    const cookieKey = 'keyboard 11cat';
    app.use(cookieParser(cookieKey));
    // app.use(require("./lib/session"));
    if ($config.session) {
        //启动session
        app.use(require("./lib/session"));
        console.log("启用session");
    }
    // 挂载response扩展方法
    const responseExtends = require("./common/response");
    app.use((req, res, next) => {
        for (let key in responseExtends) {
            res[key] = responseExtends[key];
        }
        next();
    });
    template.config('base', '');
    template.config('extname', '.html');
    app.engine('html', template.__express);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, $config.viewPath));
    //挂载静态目录
    if($config.debug == 1)
    {
        
        if ($config.staticPath.length > 0) {
            for (let p of $config.staticPath) {
                //let devpath = path.join(__dirname,"../../src/"+$config.name,p)
                let devpath = path.join(__dirname,"../src/",p)
                //console.log("静态目录 debug ",devpath);
                app.use("/static", express.static(devpath));
                app.use(express.static(devpath));
            }
        }
    }
    else
    {
        if ($config.staticPath.length > 0) {
            for (let p of $config.staticPath) {
                app.use("/static", express.static(p));
                app.use(express.static(p));
            }
        }
    }
    
    //系统中间件
    // app.use((req, res, next) => {
    //     //启用授权中间件
    //     require("./middleware/dopAuth.middle").default(req, res, next);
    //     //next();
    //     // 将req请求对象挂载到全局
    //     //global.$req = req;
    //     if($config.debug)
    //         console.log("系统中间件",new Date().getSeconds());
    // });
    middleware(app); // 调用自定义中间件
    // 挂载路由
    //router(app);
    require("./lib/controller.core")(app, require("./common/router"));
   
    app.use("/404", (req, res, next) => {
        res.send("404 ");
    });

    let build = require("./build.js").default;
    regGlobal("$build",build);
    //console.log(build);

     // 注册逻辑层
     require("./lib/LogicRegister").default();

     // 注册model
     require("./lib/ModelRegister").default();

    // 注册微服务
    if($config.msServer.isUse)
    {
        require("./lib/microServer").default();
    }
    //console.log("我服务",$config);

    // 初始化微服务客户端
    if($config.msClient.isUse)
    {
      global.$msClient =  require("./lib/microClient").default;
      console.log("初始化微服务客户端...");
    }
   
    //console.log("model test ",$model("System.test",{}));
    var server = http.createServer(app).listen($config.port, $config.host);
    // var io = require('socket.io')(server);
    await require("./common/start").default(app, server);

    await require("./lib/RegisterApp").default(); // 注册应用
    //app.listen($config.port, $config.host);
    //console.log("路由权限注册 ",$appRight);
    
    // 调试 
    app.use("/debug",async(req,res,next)=>{
        if($config.debug != 1) return next();
        res.success($config.browserProject)
    })


    console.log(`app is running,binding host is ${$config.host} and listen port ${$config.port}, and server debug is ${$config.debug}`);
    return {
        server
    };
};