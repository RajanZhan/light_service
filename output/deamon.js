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


    for (let i = 0; i < core; i++) {
        create("server");
    }


} else {
    var app = require("./app");
    let {
        server
    } = app();
    console.log(`Worker ${process.pid} started`);
}