var chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const baseDevPath = '../src/' + $config.name

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

const autowatchfiles = [
    baseDevPath + '/app.js',
    baseDevPath + '/config.json',
    baseDevPath + '/apptool.js',
    baseDevPath + '/app.config.json',
    baseDevPath + "/db.config.json",
    baseDevPath + "/redis.config.json",
    baseDevPath + "/ms.config.json",
]



const autoRestart = [
    './app.js',
    './config.json',
    "./validate",
    "./model",
    "./middleware",
    "./logic",
    "./lib",
    "./dataModel",
    "./controller",
    "./common",
    "./build.js",
    './app.config.json',
    './db.config.json',
    './redis.config.json',
    './ms.config.json',
]

const autoBuild = [
    //"./model/",
    path.join(baseDevPath, '/model/'),
    path.join(baseDevPath, '/logic/')
    //"./logic/",
]

module.exports = {

    // 文件自动同步
    autoCopyFile() {
        let startTime = new Date().getTime();
        // One-liner for current directory, ignores .dotfiles
        chokidar.watch(autowatchfiles, {
            // ignored: /(^|[\/\\])\../
        }).on('all', (event, path1) => {

            if ((new Date().getTime() - startTime) < 500) {
                return;
            }
            let from = path.join(__dirname, path1);
            let stat = fs.statSync(from);
            if (stat.isFile()) {
                let to = path.join(__dirname, path1.replace('src', 'out'));
                // 创建读取流
                let readable = fs.createReadStream(from);
                // 创建写入流
                let writable = fs.createWriteStream(to);
                // 通过管道来传输流
                readable.pipe(writable);
                console.log("文件同步..", path1);
                // console.log(from, to)
                // console.log(path.join(__dirname, path1));
            }
        });
        console.log("文件同步进程启动...");
    },
    
    
    // 自动启动服务进程
    mainProcess() {
        let startTime = new Date().getTime();
        // One-liner for current directory, ignores .dotfiles
        chokidar.watch(autoRestart, {
            // ignored: /(^|[\/\\])\../
        }).on('all', (event, path1) => {

            if ((new Date().getTime() - startTime) < 500) {
                return;
            }
            console.log("主进程重启");
            process.send({
                code: "restart",
                data: 'server'
            })
            //process.exit();
            startTime = new Date().getTime();


        });
        console.log("主进程自动重启程序监听中...");
    },

    //启动webpack前端应用
    spaWatch() {
        if ($config.debug == 1) {

            var webpack = require("webpack");
            let browserProject = $config.browserProject;
            console.log("启动前端调试 ", browserProject);
            if (browserProject && browserProject.length > 0) {
                const express = require('express');
                const template = require('art-template');
                console.log("web ui 项目启动", browserProject);
                for (let project of browserProject) {
                    if (project.active == "1") {
                        var uiApp = express();
                        // var webpackConfig = require(`./browserSrc/${project.name}/webpack.dev.config.js`);
                        var webpackConfig = require(`../../browserSrc/${project.name}/webpack.dev.config.js`);
                        var compiler = webpack(webpackConfig);
                        var WebpackHotMid = require("webpack-hot-middleware");
                        var WebpackDevMid = require("webpack-dev-middleware");
                        var webpackHotMid = WebpackHotMid(compiler); //=>require("webpack-hot-middleware")(complier)
                        var webpackDevMid = WebpackDevMid(compiler, {
                            publicPath: '/',
                            stats: {
                                colors: true,
                                chunks: false
                            }
                        });
                        uiApp.engine('html', template.__express);
                        uiApp.set('view engine', 'html');
                        uiApp.set('views', path.join(__dirname, $config.viewPath));
                        if ($config.staticPath.length > 0) {
                            for (let p of $config.staticPath) {
                                let devpath = path.join(__dirname, baseDevPath, p)
                                uiApp.use("/static", express.static(devpath));
                                uiApp.use(express.static(devpath));
                            }
                        }
                        uiApp.use(webpackDevMid);
                        uiApp.use(webpackHotMid);
                        uiApp.listen(project.port);
                        console.log(`前端单页应用 ${project.name} 启动成功，监听端口为 ${project.port}`)
                        break;
                    }
                }
            }
        }
    },

    //启动webpack前端应用 升级版  重构了UI项目
    spaWatch1() {
        if ($config.debug == 1) {

            var webpack = require("webpack");
            let browserProject = $config.ui;
            //console.log("启动前端单页调试 项目 ");
            if (browserProject && browserProject.length > 0) {
                const express = require('express');
                const template = require('art-template');
                //console.log("web ui 项目启动");
                for (let project of browserProject) {
                    if (project.active == "1") {
                        var uiApp = express();
                        // var webpackConfig = require(`./browserSrc/${project.name}/webpack.dev.config.js`);
                        var webpackConfig = require(`../../ui/${project.name}.webpack.config.dev.js`);
                        var compiler = webpack(webpackConfig);
                        var WebpackHotMid = require("webpack-hot-middleware");
                        var WebpackDevMid = require("webpack-dev-middleware");
                        var webpackHotMid = WebpackHotMid(compiler); //=>require("webpack-hot-middleware")(complier)
                        var webpackDevMid = WebpackDevMid(compiler, {
                            publicPath: '/',
                            stats: {
                                colors: true,
                                chunks: false
                            }
                        });
                        uiApp.engine('html', template.__express);
                        uiApp.set('view engine', 'html');
                        uiApp.set('views', path.join(__dirname, $config.viewPath));
                        if ($config.staticPath.length > 0) {
                            for (let p of $config.staticPath) {
                                let devpath = path.join(__dirname, baseDevPath, p)
                                uiApp.use("/static", express.static(devpath));
                                uiApp.use(express.static(devpath));
                            }
                        }
                        uiApp.use(webpackDevMid);
                        uiApp.use(webpackHotMid);
                        uiApp.listen(project.port);
                        console.log(`前端单页应用 ${project.name} 启动成功，监听端口为 ${project.port}`)
                        //break;
                    }
                }
            }
        }
    },

    //监听logic 和model 预编译
    autoBuildInclude() {
        let startTime = new Date().getTime();
        chokidar.watch(autoBuild, {
            // ignored: /(^|[\/\\])\../
        }).on('all', (event, path1) => {

            if ((new Date().getTime() - startTime) < 500) {
                return;
            }
            //console.log("主进程重启");
            //process.send({code:"restart",data:'server'})
            //process.exit();
            //console.log(path.join(__dirname,path1));
            //return
            //console.log("model logic 自动编译",`src\\${$config.name}\\model`);
            let stat = fs.statSync(path.join(__dirname, path1));
            if (stat.isFile()) {
                // let to = path.join(__dirname, path1.replace('src', 'out'));
                // // 创建读取流
                // let readable = fs.createReadStream(from);
                // // 创建写入流
                // let writable = fs.createWriteStream(to);
                // // 通过管道来传输流
                // readable.pipe(writable);

                let oriStr = `
                "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 编译文件 配置 */
exports.default = {
    {replace}
};`
                let allstr = '';

                let modelstr = `src\\${$config.name}\\model`;
                let logicstr = `src\\${$config.name}\\logic`
                for (let p of autoBuild) {
                    var str = '';
                    if (p.indexOf(modelstr) != -1) {
                        str = "model:{"
                    } else if (p.indexOf(logicstr) != -1) {
                        str = "logic:{"
                    } else {
                        console.log("autoBuildInclude error 未知文件类型", p);
                    }
                    let arr = fs.readdirSync(path.join(__dirname, p));
                    console.log(arr);
                    for (let f of arr) {


                        let mp = path.basename(f, '.ts');
                        if (p.indexOf(modelstr) != -1) {
                            str += `
                            "${mp}": require("./model/${mp}"),
                            `
                        } else if (p.indexOf(logicstr) != -1) {
                            str += `
                            "${mp}": require("./logic/${mp}"),
                            `
                        }

                    }
                    str += '}'
                    allstr += str + ","
                }

                fs.writeFileSync("./build.js", oriStr.replace('{replace}', allstr));

                // fs.readdirSync();
                // console.log(stat,"编译包含..");
                // console.log(from, to)
                // console.log(path.join(__dirname, path1));
            }


        });
        console.log("自动编译文件包含 监听中...");
    },
    

    // 开发工具 接口
    devTool() {

        let startTime = new Date().getTime();
        chokidar.watch(["./dev.js"], {
            // ignored: /(^|[\/\\])\../
        }).on('all', (event, path1) => {

            if ((new Date().getTime() - startTime) < 500) {
                return;
            }
            console.log("devTool 重启...");
            process.send({
                code: "restart",
                data: 'devTool'
            })
        });
        console.log("devTool自动重启程序监听中...");

        // 删除文件夹
        function deleteFolder(path) {
            var files = [];
            if (fs.existsSync(path)) {
                files = fs.readdirSync(path);
                files.forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.statSync(curPath).isDirectory()) { // recurse
                        deleteFolder(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }

        }

        // 复制文件夹
        function cpdir() {
            var fs = require('fs'),
                stat = fs.stat;
            /*
            05
             * 复制目录中的所有文件包括子目录
            06
             * @param{ String } 需要复制的目录
            07
             * @param{ String } 复制到指定的目录
            08
             */
            var copy = function (src, dst) {
                // 读取目录中的所有文件/目录
                fs.readdir(src, function (err, paths) {
                    if (err) {
                        throw err;
                    }

                    paths.forEach(function (path) {
                        var _src = src + '/' + path,
                            _dst = dst + '/' + path,
                            readable, writable;

                        stat(_src, function (err, st) {
                            if (err) {
                                throw err;
                            }

                            // 判断是否为文件
                            if (st.isFile()) {
                                // 创建读取流
                                readable = fs.createReadStream(_src);
                                // 创建写入流
                                writable = fs.createWriteStream(_dst);
                                // 通过管道来传输流
                                readable.pipe(writable);
                            }
                            // 如果是目录则递归调用自身
                            else if (st.isDirectory()) {
                                exists(_src, _dst, copy);
                            }
                        });
                    });
                });
            };
            // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
            var exists = function (src, dst, callback) {
                return new Promise((resolve, reject) => {
                    fs.exists(dst, function (exists) {
                        // 已存在
                        if (exists) {
                            callback(src, dst);
                        }
                        // 不存在
                        else {
                            fs.mkdir(dst, function () {
                                callback(src, dst);
                            });
                        }
                    });
                })

            };
            return {
                copy,
                exists
            }
        }


        const uiPath = "../../ui"; //UI项目的路径
        const apiSrcPath = "../../src/"; //API应用src的路径
        const apiOutPath = "../../out/"; //API应用out的路径

        const corePath = "../../../核心库"
        const path = require("path");
        const fs = require("fs");
        var port = 8003; // 监听的端口
        var express = require('express');
        var app = express();
        const bodyParser = require('body-parser');
        const $tp = require('art-template');

        app.use("/devTool", express.static(path.join(__dirname, "devTool")));

        app.use(bodyParser.json({
            limit: '50mb'
        }));
        app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true,
            parameterLimit: 50000
        }));
        // 跨域处理
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Token,Appid,AppId");
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
            next();
            //console.log("跨域处理hahah");
        });

        app.get('/', function (req, res) {
            res.send(`
			<meta charset="UTF-8">
			  <a href="/devTool/index.html#/">欢迎使用集成开发者工具</a>
			`);
        })

        // 读取组件分组
        app.get('/getComGroup', function (req, res) {
            let comlist = path.join(__dirname, uiPath, "components");
            let list = fs.readdirSync(comlist);
            res.send(list);
        })

        // 读取页面分组
        app.get('/getPageGroup', function (req, res) {
            let comlist = path.join(__dirname, uiPath, "pages");
            let list = fs.readdirSync(comlist);
            res.send(list);
        })

        // 读取模板列表
        app.get('/getComTplList', function (req, res) {
            let comlist = path.join(__dirname, corePath, "ui/comTpl");
            let list = fs.readdirSync(comlist);
            let result = [];
            for (let l of list) {
                let tplPath = path.join(__dirname, corePath, "ui/comTpl", l);
                delete require.cache[require.resolve(tplPath)];
                let tpl = require(tplPath);
                result.push(tpl);
            }
            res.send(result);
        })


        // 读取UI应用列表
        app.get('/getUIAppList', function (req, res) {
            let listpath = path.join(__dirname, uiPath, );
            let list = fs.readdirSync(listpath);
            let result = [];
            for (let l of list) {
                var reg = new RegExp("[\s\S]*.main.js");
                if (reg.test(l)) {
                    let appName = l.split('.')[0];
                    let descPath = path.join(__dirname, uiPath, `${appName}.desc.js`);
                    let appInfo = {
                        desc: ""
                    };
                    if (fs.existsSync(descPath)) {
                        delete require.cache[require.resolve(descPath)];
                        appInfo = require(descPath);
                    }

                    result.push({
                        name: appName,
                        desc: appInfo.desc,
                    });
                }
            }
            res.send(result);
        })

        // 读取API应用列表
        app.get('/getApiAppList', function (req, res) {
            let listpath = path.join(__dirname, apiSrcPath, );
            let list = fs.readdirSync(listpath);
            let result = [];
            for (let l of list) {
                let appName = l;
                let descPath = path.join(__dirname, apiSrcPath, appName, `${appName}.api.desc.js`);
                let appInfo = {
                    desc: ""
                };
                if (fs.existsSync(descPath)) {
                    delete require.cache[require.resolve(descPath)];
                    appInfo = require(descPath);
                }

                result.push({
                    name: appName,
                    desc: appInfo.desc,
                });
            }
            res.send(result);
        })

        // 读取数据模型
        app.get('/getDataModelList', function (req, res) {
            let apiAppName = req.query.name;
            let listpath = path.join(__dirname, apiSrcPath, apiAppName, "dataModel");
            let list = fs.readdirSync(listpath);
            //return res.send(list);
            let result = [];
            for (let l of list) {
                let appName = l.split('.')[0];
                result.push({
                    name: appName,
                });
            }
            res.send(result);
        })

        // 渲染
        app.get("/tp", async (req, res) => {
            try {
                let render = $tp.compile(`
                 <h1>{{name}}</h1>
                `);
                res.send(render({
                    name: "rajan"
                }));

            } catch (err) {
                console.log(err);
            }
        })

        // 创建ui组件
        app.post('/createUICom', function (req, res) {
            let data = req.body;
            if (!data.name) {
                return res.send({
                    code: -1,
                    msg: "组件名称不能为空"
                });
            }
            if (!data.type) {
                return res.send({
                    code: -1,
                    msg: "组件类型不能为空"
                });
            }
            if (!data.tpl) {
                return res.send({
                    code: -1,
                    msg: "组件模板不能为空"
                });
            }

            if (!data.path) {
                return res.send({
                    code: -1,
                    msg: "组件存放路径不能为空"
                });
            }
            if (!data.data) {
                return res.send({
                    code: -1,
                    msg: "组件参数不能为空"
                });
            }
            let tpl = JSON.parse(data.tpl);
            let template = tpl.template;
            let options = JSON.parse(data.data);
            let rsTemplate = "";
            let renderdata = []; // 模板渲染的数据
            for (let d of options) {

                if (d.type == 'text') {
                    if (!d.value) {
                        continue;
                    }
                    let obj = eval(d.value);
                    renderdata[d.mark] = obj;

                } else {
                    //console.log(d.mark,d.value);
                    let re = new RegExp(`%${d.mark}%`, "g")
                    template = template.replace(re, d.value)
                }
            }
            let render = $tp.compile(template);
            template = render(renderdata); // 进行模板渲染
            //return res.send(template);

            // 组件的路径
            let cp = "pages";
            if (data.type == 'page') {
                cp = "pages"
            } else if (data.type == 'com') {
                cp = "components"
            } else {
                return res.send({
                    code: -1,
                    msg: "未知组件类型"
                });
            }

            let comPath = path.join(__dirname, uiPath, cp, data.path, data.name);
            //console.log(comPath);
            if (fs.existsSync(comPath)) {
                if (!data.force || data.force != 1) {
                    return res.send({
                        code: -1,
                        msg: "组件已经存在"
                    });
                }
            } else {
                fs.mkdirSync(comPath);
            }

            // 处理 标签模板
            // let renderData = {}
            // let render = $tp.compile(template);
            // template = render(renderData);

            // 写入组件
            fs.writeFileSync(comPath + `/${data.name}.vue`, template);

            //console.log(template,comPath);
            res.send({
                code: 1,
                msg: "创建成功"
            });
        })

        // 创建ui应用
        app.post('/createUIApp', async function (req, res) {

            try {
                let data = req.body;
                if (!data.name) {
                    return res.send({
                        code: -1,
                        msg: "应用名称不能为空"
                    });
                }

                async function createuiproject(projectName) {
                    let mainPath = path.join(__dirname, uiPath, `${projectName}.main.js`);
                    if (fs.existsSync(mainPath)) {
                        if (!data.force) {
                            //return console.error();
                            throw new Error(`ui应用${projectName}可能已经存在`)
                        }
                        //await endTimer(5, `将【强制】创建${projectName}ui应用`);
                    }

                    // 创建应用描述文件
                    let descPath = path.join(__dirname, uiPath, `${projectName}.desc.js`);
                    let str = `module.exports = `
                    fs.writeFileSync(descPath, str + JSON.stringify({
                        desc: data.desc
                    }))

                    // 创建main js 文件
                    let srcmain = fs.readFileSync(path.join(__dirname, corePath, "ui/main.js"));
                    fs.writeFileSync(mainPath, srcmain.toString().replace(/\${appName}/g, projectName))

                    // 创建config 文件
                    let configcode = fs.readFileSync(path.join(__dirname, corePath, "ui/config.js"));
                    fs.writeFileSync(path.join(__dirname, '../../ui/config/', `${projectName}.config.js`), configcode);

                    // 创建router文件
                    let routercode = fs.readFileSync(path.join(__dirname, corePath, "ui/router.js"));
                    fs.writeFileSync(path.join(__dirname, '../../ui/router/', `${projectName}.router.js`), routercode.toString().replace(/\${appName}/g, projectName));

                    // 创建store文件
                    let storePath = path.join(__dirname, "../../ui/store", projectName)
                    if (!fs.existsSync(storePath)) {
                        fs.mkdirSync(storePath)
                    }
                    let storecode = fs.readFileSync(path.join(__dirname, corePath, "ui/store.js"));
                    fs.writeFileSync(path.join(__dirname, '../../ui/store/', projectName, `index.store.js`), storecode);

                    // 创建webpack 配置文件
                    let webpackcodedev = fs.readFileSync(path.join(__dirname, corePath, "ui/devConfig/", "webpack.config.dev.js"));
                    fs.writeFileSync(path.join(__dirname, uiPath, `${projectName}.webpack.config.dev.js`), webpackcodedev.toString().replace(/\${appName}/g, projectName));

                    let webpackcode = fs.readFileSync(path.join(__dirname, corePath, "ui/devConfig/", "webpack.config.js"));
                    fs.writeFileSync(path.join(__dirname, uiPath, `${projectName}.webpack.config.js`), webpackcode.toString().replace(/\${appName}/g, projectName));


                    // 创建常规页面
                    let pagePath = path.join(__dirname, "../../ui/pages", projectName)
                    if (!fs.existsSync(pagePath)) {
                        fs.mkdirSync(pagePath)
                    }
                    let indexvue = fs.readFileSync(path.join(__dirname, corePath, "ui/page/index/", "index.vue"));
                    fs.writeFileSync(pagePath + "/index.vue", indexvue.toString().replace(/\${appName}/g, projectName));

                    let indexless = fs.readFileSync(path.join(__dirname, corePath, "ui/page/index/", "index.less"));
                    fs.writeFileSync(pagePath + "/index.less", indexless);

                    //console.log(srcmain.toString().replace(/\${appName}/g,projectName));
                    // let srcpath = path.join(__dirname, "./ui/" + projectName);
                    // let outpath = path.join(__dirname, "./out/" + projectName);
                    // deleteFolder(srcpath);
                    // deleteFolder(outpath);
                    //console.log("ui项目创建成功");

                }
                await createuiproject(data.name);

                //console.log(template,comPath);
                res.send({
                    code: 1,
                    msg: "创建成功"
                });
            } catch (err) {
                res.send({
                    code: -1,
                    msg: err.message
                })
            }

        })

        // 删除ui应用
        app.post('/removeUIApp', async function (req, res) {

            try {
                let data = req.body;
                if (!data.name) {
                    return res.send({
                        code: -1,
                        msg: "应用名称不能为空"
                    });
                }
                async function removeuiproject(projectName) {


                    // 删除应用描述文件
                    let descPath = path.join(__dirname, uiPath, `${projectName}.desc.js`);
                    if (fs.existsSync(descPath)) {
                        fs.unlinkSync(descPath);
                    }
                    // main文件
                    let mainPath = path.join(__dirname, '../../ui', `${projectName}.main.js`);
                    if (fs.existsSync(mainPath)) {
                        fs.unlinkSync(mainPath);
                    }


                    // config 文件
                    let configpath = path.join(__dirname, '../../ui/config/', `${projectName}.config.js`)
                    if (fs.existsSync(configpath)) {
                        fs.unlinkSync(configpath);
                    }

                    // router文件
                    let routercode = path.join(__dirname, '../../ui/router/', `${projectName}.router.js`)
                    if (fs.existsSync(routercode)) {
                        fs.unlinkSync(routercode);
                    }


                    // store文件
                    let storeFilePath = path.join(__dirname, '../../ui/store/', projectName);
                    if (fs.existsSync(storeFilePath)) {
                        deleteFolder(storeFilePath)
                    }

                    // 创建webpack 配置文件
                    let webpackcodedev = path.join(__dirname, "../../ui", `${projectName}.webpack.config.dev.js`)
                    if (fs.existsSync(webpackcodedev)) {
                        fs.unlinkSync(webpackcodedev)
                    }

                    let webpackcode = path.join(__dirname, "../../ui", `${projectName}.webpack.config.js`);
                    if (fs.existsSync(webpackcode)) {
                        fs.unlinkSync(webpackcode)
                    }

                    // 常规页面
                    let pagePath = path.join(__dirname, "../../ui/pages", projectName)
                    if (fs.existsSync(pagePath)) {
                        deleteFolder(pagePath)
                    }

                    //console.log("ui项目删除成功");

                }

                await removeuiproject(data.name);

                //console.log(template,comPath);

                res.send({
                    code: 1,
                    msg: "删除成功"
                });

            } catch (err) {
                res.send({
                    code: -1,
                    msg: err.message
                })
            }

        })


        // 创建api应用
        app.post('/createApiApp', async function (req, res) {
            try {
                let data = req.body;
                if (!data.name) {
                    return res.send({
                        code: -1,
                        msg: "api应用名称不能为空"
                    });
                }

                async function createApiApp(projectName) {

                    try {
                        let srcpath = path.join(__dirname, "../../src/" + projectName);
                        let outpath = path.join(__dirname, "../../out/" + projectName);
                        //console.log("创建API应用start");
                        if (fs.existsSync(srcpath) || fs.existsSync(outpath)) {
                            if (!data.force) {
                                throw new Error(`项目${projectName}可能已经存在`);
                            }
                            //await endTimer(10, `将创建${projectName}api应用`);
                            deleteFolder(srcpath);
                            deleteFolder(outpath);
                            //await sleep(5000);

                        } 
                        fs.mkdirSync(srcpath);
                        fs.mkdirSync(outpath);

                        const {
                            copy
                        } = cpdir();

                        //await sleep(5000);

                        // 复制src 文件夹
                        copy(path.join(__dirname, corePath, 'src', ), srcpath)
                        //await copyFolder(path.join(__dirname, corePath, 'src', ), srcpath)

                        // 复制 out文件夹
                        copy(path.join(__dirname, corePath, 'out'), outpath);
                        //await copyFolder(path.join(__dirname, corePath, 'out'), outpath)
                        //console.log("创建API应用ok");

                        //await sleep(5000);

                        // 创建应用的描述文件
                        let descPath = path.join(__dirname, apiSrcPath, data.name, `${data.name}.api.desc.js`);
                        let str = `module.exports = `
                        fs.writeFileSync(descPath, str + JSON.stringify({
                            desc: data.desc
                        }))

                        // 创建config.json 文件
                        let conf = fs.readFileSync(path.join(__dirname, corePath,"api.config.json"));
                        let re = new RegExp(`%appName%`, "g")
                        conf =  conf.toString().replace(re,projectName)
                        fs.writeFileSync(srcpath +"/config.json",conf);
                        fs.writeFileSync(outpath +"/config.json",conf);

						 // 创建启动文件
                        let startScript = `
                        @echo off
                        call cd ../ && cd out && cd ${projectName}
                        call npm run dev
                        `
                         fs.writeFileSync(path.join(__dirname,'../../应用启动脚本/',`${projectName}.bat`),startScript)


						
                        //console.log("创建项目成功");
                    } catch (err) {
                        console.log("createApiApp err", err);
                        throw err;
                    }

                }
                await createApiApp(data.name);



                //console.log(template,comPath);
                res.send({
                    code: 1,
                    msg: "创建成功"
                });
            } catch (err) {
                res.send({
                    code: -1,
                    msg: err.message
                });
            }

        })

        // 创建api crud
        app.post('/createCrud', async function (req, res) {
            try {
                let data = req.body;
                if (!data.apiApp) {
                    return res.send({
                        code: -1,
                        msg: "api应用名称不能为空"
                    });
                }
                if (!data.model) {
                    return res.send({
                        code: -1,
                        msg: "数据模型不能为空"
                    });
                }
                data.force = Boolean(data.force);

                function createCrud(apiApp, modelName) {
                    let modelOutPath = "../../out/" + apiApp
                    let modelpath = path.join(__dirname, modelOutPath, "dataModel");
                    let models = fs.readdirSync(modelpath);
                    //console.log(modelpath);
                    let dmodelmap = new Map();
                    for (let p of models) {
                        let pathtmo = path.join(__dirname, modelOutPath, "dataModel", p)
                        let stat = fs.statSync(pathtmo);
                        //console.log(p);
                        if (stat.isFile()) {
                            let m = require(pathtmo);
                            if (m.default) {
                                //console.log(m.default.name);
                                dmodelmap.set(p.split(".")[0], m.default);
                            }
                        }
                    }
                    //console.log(modelName,"modelname");
                    let model = dmodelmap.get(modelName);
                    if (!model) {
                        throw new Error("数据模型  " + modelName + " 不存在，无法创建curd");
                    }
                    //检测controller，logic  model 是否存在，如果存在 需报警提示

                    // model 检测并生成
                    let modelOutFilePath = path.join(__dirname, "../../src/" + apiApp + "/model/" + modelName + ".Model.ts")
                    let existModel = fs.existsSync(modelOutFilePath);
                    if (data.force || !existModel) {
                        // 创建model 
                        let str = `
                        import { BaseModel } from "../lib/Base.Model"
                        export class ${modelName} extends BaseModel {
                            opt: object;
                        
                            constructor(opt: object) {
                                super();
                                this.opt = opt;
                            }
                
                            /**
                             * 默认首先的执行的方法 
                             * @param action  调用的方法
                             * @param params  对应的参数
                             */
                                 async _init(action, params:any) {
                                     //console.log("article column ");
                                     let sysUserScoped = new Set(['list', 'search', "getByColNameForUser"]); // 这些方法需要进行 账户作用域的限制
                                     if (sysUserScoped.has(action)) {
                                         if(!params.where) params.where = {};
                                         if(typeof (params.where) == 'string')
                                         {
                                             params.where = JSON.parse(params.where);
                                         }
                                         params.where['sysuid'] = $mainUserInfo.uid;
                                     }
                                     return params;
                                 }
                             
                
                    /**
                     * 根据id查询
                     * @param data
                     * @return array
                    */
                    async get(data: any) {
                        try {
                            if (!data || !data.id) {
                                throw new Error('id is empty in article model in get function')
                            }
                            data.where = {
                                id:data.id
                            }
                            let res = await this.model("${modelName}").findOne(data);
                            return res;
                        }
                        catch (err) {
                            throw err
                        }
                    }

                    /**
                        * 根据条件搜索
                        * @param data
                        * @return array
                    */
                        async search(data: any) {
                            try {
                                let where = {}
                                if (data.where) {
                                    for (let i in data.where) {
                                        where[i] = {
                                            $like: "%" + data.where[i] + "%"
                                        }
                                    }
                                }
                                data.where = where;
                                let res = await this.model("${modelName}").findAll(data);
                                return res;
                            }
                            catch (err) {
                                throw err
                            }
                        }
                
                
                    /**
                     * 读取列表
                     * @param data {page,psize} 
                     * @return array
                    */
                    async list(data: any) {
                        try {
                            if (!data) {
                                throw new Error('data is empty in article model in list function')
                            }
                            let res = await this.model("${modelName}").findAll(data);
                            return res;
                        }
                        catch (err) {
                            throw err
                        }
                    }
                
                          
                         
                          /**
                      * 增加
                      * @param data any
                      * @return array
                     */
                    async add(data: any) {
                        try {
                            if (!data) {
                                throw new Error('data is empty in article model in add function')
                            }
                            let primaryKey = <any>$modelPrimaryKeyMap.get("${modelName}");
                            if (!primaryKey) {
                                throw new Error("模型主键查询失败，${modelName}.Model.add ");
                            }
                            data[primaryKey.vfield] = $common.getId(); // 主键
                            data.sts = 1;
                            data.ct = new Date();
                            let res =  await this.model("${modelName}").create(data);
                            return res;
                        }
                        catch (err) {
                            throw err
                        }
                    }
                
                
                        
                          /**
                      * 修改
                      * @param data any
                      * @return array
                     */
                    async update(data: any) {
                        try {
                           
                            let primaryKey = <any>$modelPrimaryKeyMap.get("${modelName}");
                            if (!primaryKey) {
                                throw new Error("模型主键查询失败，${modelName}.Model.update ");
                            }
                
                            if (!data || !data[primaryKey.vfield]) {
                                throw new Error('data or 主键  is empty in ${modelName} model in update function')
                            }
                            let where = {};
                            where[primaryKey.realField] = data[primaryKey.vfield]
                            let res = await this.model("${modelName}").update(data,{
                                where:where
                            });;
                            return res;
                        }
                        catch (err) {
                            throw err
                        }
                    }
                
                
                          /**
                      * 删除
                      * @param data
                      * @return array
                     */
                    async delete(data: any) {
                        try {
                            let primaryKey = <any>$modelPrimaryKeyMap.get("${modelName}");
                            if (!primaryKey) {
                                throw new Error("模型主键查询失败，${modelName}.Model.delete ");
                            }
                            
                            if (!data || !data[primaryKey.vfield]) {
                                throw new Error('data or 主键  is empty in article model in delete function')
                            }
                            let where = {};
                            where[primaryKey.realField] = data[primaryKey.vfield]
                            let res = await this.model("${modelName}").destroy({
                                where:where
                            });;
                            return res ;
                            
                        }
                        catch (err) {
                            throw err
                        }
                    }
                
                
                        }
                        `
                        fs.writeFileSync(modelOutFilePath, str);
                        console.log(`创建 ${modelName} model 成功`)
                    } else {
                        throw new Error(`${modelName} model 已经存在`);
                    }


                    // logic 检测并生成
                    let logicOutFilePath = path.join(__dirname, "../../src/" + apiApp + "/logic/" + modelName + ".Logic.ts")
                    let existLogic = fs.existsSync(logicOutFilePath);
                    if (data.force || !existLogic) {
                        // 创建model 
                        let str = `
                        import BaseLoigc from "../lib/Base.Logic"
                var Logic = {
                
                    /** 系统预制变量 start */
                    AUTH: {},
                    setAuthInfo: null,
                    getAuthInfo: null,
                    _init:null,// 初始化的方法
                    /** 系统预制变量 end */
                
                
                    /** 读取单条信息 */
                    async get(data) {
                        await $logic([
                            {
                                data:"id",
                                require:true,
                                msg:"${modelName} id不能为空"
                            }
                        ],data)
                        return await $model("${modelName}.get",data);
                    },

                    /** 读取单条信息 */
                    async search(data) {
                        return await $model("${modelName}.search", data);
                    },
                
                    /** 读取列表 */
                    async list(data) {
                        
                        await $logic([
                            
                        ],data)
                        return await $model("${modelName}.list",data);
                    },
                
                    /** 添加数据 */
                    async add(data) {
                        
                        await $logic([
                            
                        ],data)
                        return await $model("${modelName}.add",data);
                    },
                
                    /** 修改数据 */
                    async update(data) {
                        
                        await $logic([
                            {
                                data:"id",
                                require:true,
                                msg:"${modelName} id不能为空"
                            }
                        ],data)
                        return await $model("${modelName}.update",data);
                    },
                
                    /** 删除数据 */
                    async delete(data) {
                        
                        await $logic([
                            {
                                data:"id",
                                require:true,
                                msg:"${modelName} id不能为空"
                            }
                        ],data)
                        return await $model("${modelName}.delete",data);
                    },
                }
                
                Logic.AUTH = {}
                Logic.setAuthInfo = BaseLoigc.setAuthInfo;
                Logic.getAuthInfo = BaseLoigc.getAuthInfo;
                Logic._init = BaseLoigc._init;
                export default Logic
                
                        `
                        fs.writeFileSync(logicOutFilePath, str);
                        console.log(`创建 ${modelName} logic 成功`)
                    } else {
                        throw new Error(`${modelName} logic 已经存在`);
                    }


                    // 生成控制器

                    let controllerOutFilePath = path.join(__dirname, "../../src/" + apiApp + "/controller/" + modelName + ".Controller.ts")
                    let existController = fs.existsSync(controllerOutFilePath);
                    if (data.force || !existController) {
                        // 创建controller 
                        let str = `
                        export default (path) => {
                    
                            const controller = require("../lib/routerRegister")(path);
                            const router = controller.router;
                        
                            // 中间件
                            function middle(req, res, next) {
                                next()
                            }
                
                            // get by id 
                            controller.get("/get", "读取${modelName}详细数据", async (req, res) => {
                                try {
                                    let result = await $lg("${modelName}.get", req.query);
                                    res.ok(result)
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });

                            // 搜索
                            controller.get("/search", "搜索${modelName}详细数据", async (req, res) => {
                                try {
                                    let result = await $lg("${modelName}.search", req.query);
                                    res.success(result)
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });

                
                            // get list 
                            controller.get("/list", "读取${modelName}列表数据", async (req, res) => {
                                try {
                                    let result = await $lg("${modelName}.list", req.query);
                                    res.ok(result)
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });
                
                            // add
                            controller.post("/add","添加${modelName}单条数据", async (req, res) => {
                                try {
                                    let result = await $lg('${modelName}.add', req.body);
                                    res.ok(result);
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });
                
                            // update
                            controller.post("/update","修改${modelName}数据", async (req, res) => {
                                try {
                                    let result = await $lg('${modelName}.update', req.body);
                                    res.ok(result);
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });
                
                
                            // delete
                            controller.post("/delete","删除${modelName}数据", async (req, res) => {
                                try {
                                    let result = await $lg('${modelName}.delete', req.body);
                                    res.ok(result);
                                }
                                catch (err) {
                                    let msg = err.message
                                    $logger.error({ err: err, msg: msg });
                                    res.error(msg);
                                }
                            });
                        
                        
                            return {
                                router,
                                middle
                            };
                        }
                        `
                        fs.writeFileSync(controllerOutFilePath, str);
                        console.log(`创建 ${modelName} controller 成功`)
                    } else {
                        throw new Error(`${modelName} controller 已经存在`);
                    }

                }
                createCrud(data.apiApp, data.model);
                //console.log(template,comPath);
                res.send({
                    code: 1,
                    msg: "创建成功"
                });
            } catch (err) {
                res.send({
                    code: -1,
                    msg: err.message
                })
            }

        })


        // 删除api应用
        app.post('/removeApiApp', async function (req, res) {

            try {
                let data = req.body;
                if (!data.name) {
                    return res.send({
                        code: -1,
                        msg: "应用名称不能为空"
                    });
                }

                // 删除api后台项目
                async function removeapiproject(projectName) {
                    let srcpath = path.join(__dirname, "../../src/" + projectName);
                    let outpath = path.join(__dirname, "../../out/" + projectName);
                    deleteFolder(srcpath);
                    deleteFolder(outpath);

                    //console.log("删除项目成功");
                }
                await removeapiproject(data.name);


                res.send({
                    code: 1,
                    msg: "删除成功"
                });

            } catch (err) {
                res.send({
                    code: -1,
                    msg: err.message
                })
            }

        })





        var server = app.listen(port, function () {

            var host = server.address().address
            var port = server.address().port

            console.log("开发工具启动成功，API地址为 http://%s:%s", host, port)

        })
    },

    // 
}