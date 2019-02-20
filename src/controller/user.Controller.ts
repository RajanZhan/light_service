
export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    function middle(req, res, next) {
        next()
    }

    // 系统用户授权
    controller.post("/auth", "", async (req, res) => {

        try {
            // let result = await $msClient({
            //     interfaceName: "dopVip.Public",
            //     actionName: "test",
            //     params: [{ name: 'rajan' }, { uid: 1, type: "main" }],
            // })
            //console.log("auth controller ");
            // res.ok(result);
            let result = await $lgc("user.auth",req,req.body);
            //console.log(result);
            res.ok(result);
        }
        catch (err) {
            console.log(err);
            res.error(err.message);
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
