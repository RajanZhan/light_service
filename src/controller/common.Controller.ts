
export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    function middle(req, res, next) {
        next()
    }

    controller.get("/common",'',async(req:request,res:response)=>{
        res.display("common",{title:"common title"})
    })

    controller.post("/auth", "通用平台账号授权", async (req, res) => {
        try {
            let result = <any> await $lgc("common.sysUserLogin",req,req.body);
            if (!result) {
                throw new Error("读取登录结果为空");
            }
            let { token } = req.createDopAuthInfo({
                ip: req.ip,
                userInfo: result
            });

            return res.ok({
                token: token
            });

        }
        catch (err) {
            console.log(err);
            res.error(err.message);
        }
    })


    // 测试
    controller.get("/test", "测试接口", async (req, res) => {

        try {
            let result = await $msClient({
                interfaceName: "Common.user",
                actionName: "getSysUserByName",
                params: [{ name: 'rajan',type:'main'}, {uid:1}],
            })
            // console.log(result);
            res.ok(result);
        }
        catch (err) {
            res.error(err);
        }

    })

    // get by id 
    controller.get("/get", "读取article详细数据", async (req, res) => {
        try {
            let result = await $lg("article.get", req.query);
            res.success(result)
        }
        catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    });

    // get list 
    controller.get("/list", "读取article列表数据", async (req, res) => {
        try {
            let result = await $lg("article.list", req.query);
            res.success(result)
        }
        catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    });

    // add
    controller.post("/add", "添加article单条数据", async (req, res) => {
        try {
            let result = await $lg('article.add', req.body);
            res.success(result);
        }
        catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    });

    // update
    controller.post("/update", "修改article数据", async (req, res) => {
        try {
            let result = await $lg('article.update', req.body);
            res.success(result);
        }
        catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    });


    // delete
    controller.post("/delete", "删除article数据", async (req, res) => {
        try {
            let result = await $lg('article.delete', req.body);
            res.success(result);
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
