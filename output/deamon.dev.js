const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const path = require("path");
const jsonmini = require("jsonminify");
var sysConfig = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
if (fs.existsSync(path.join(__dirname, "./app.config.json"))) {
    let appConfig = JSON.parse(jsonmini(fs.readFileSync("./app.config.json").toString()));
    for (let c in appConfig) {
        sysConfig[c] = appConfig[c];
    }
}
global.$config = sysConfig;
if (cluster.isMaster) {
    var processMap = {};
    var core = 1;
    if ($config.debug == 1) {
        core = 1;
    } else {
        core = os.cpus().length;
    }
    // cluster.on('fork', (worker) => {
    //     processMap[worker.id] = ;
    // });
    //var clusters = [];
    var create = (flag) => {
        var worker = cluster.fork();
        console.log("启动进程", flag);
        worker.send({
            code: "init",
            type: "down",
            data: flag
        })
        worker.on('exit', (w, code) => {
            console.log("子进程挂了", processMap[worker.id], );
            // if(processMap[worker.id] == "mainProcess")
            // {
            //     create("server");
            // }
            create(processMap[worker.id]);
            // 检查 workersInfoMap 中该摄像机是否继续推流，如果继续 则需要重新启动
        });
        processMap[worker.id] = flag;
        processMap[flag] = worker;
    }
    cluster.on("message", () => {

    })
    cluster.on('message', (worker, message, handle) => {

        if (message.code == 'restart') {
            console.log(message, "main msg");
            let w = processMap[message.data];
            if (w) {
                w.send(message);
            } else {
                console.log("workder bucunzai ");
            }
        }
    });

    for (let i = 0; i < core; i++) {
        create("server");
    }
    // 启动文件自动同步进程，用于开发环境
    if ($config.debug == 1) {
        // const {
        //     autoCopyFile,
        //     mainProcess,
        //     spaWatch
        // } = require("./dev");
        // autoCopyFile();
        // mainProcess();
        create("autoCopyFile");
        create("mainProcess");
        create("spaWatch");
        create("autoBuildInclude");
        create("devTool");
    }

} else {
    const {
        autoCopyFile,
        mainProcess,
        spaWatch1,
        autoBuildInclude,
        devTool,
    } = require("./dev");
    global.$type = ""
    process.on("message", (msg) => {
        console.log(msg);

        if (msg) {
            if (msg.code == "init") {
                $type = msg.data;
                switch (msg.data) {
                    case 'server':

                        var app = require("./app");
                        if ($config.debug == 1) {
                            delete require.cache[require("./app")]
                        }
                        let {
                            server
                        } = app();
                        console.log(`Worker ${process.pid} started`);
                        break;
                    case 'autoCopyFile':
                        autoCopyFile();
                        break;
                    case 'mainProcess':
                        mainProcess()
                        break;
                    case 'spaWatch':
                        //spaWatch();
                        spaWatch1();
                        break;
                    case 'autoBuildInclude':
                        autoBuildInclude();
                        break;
                    case 'devTool':
                        devTool();
                        break;

                }
            } else if (msg.code == "restart") {
                console.log(msg, "在子进程中启动");
                if ($type == msg.data) {
                    process.exit();
                }
            }
        }

    })

}