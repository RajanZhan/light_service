export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    async function middle(req: request, res: response, next) {
        let islogin = await req.session('login');
        if (!islogin) {
            return res.rego("/login");
        }
        next()
    }

    controller.get("/", "", async (req: request, res: response) => {
        try {

            res.display("index", {});
        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })

    controller.get("/xiaoqihezuo", "", async (req: request, res: response) => {
        try {

            res.display("xiaoqihezuo", {});
        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })

    controller.get("/zhishihudong", "", async (req: request, res: response) => {
        try {

            res.display("zhishihudong", {});
        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })

    controller.get("/logout", "", async (req: request, res: response) => {
        try {
            req.dsession("login");
            res.rego("/login");
        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })
    controller.post("/", "", async (req: request, res: response) => {
        try {
            let name = req.query.name;
            let pwd = req.query.pwd;
            if (!name || !pwd) {
                return res.ok("密码或者账户名不能为空");
            }

            if (name == 'luolaoshi' && pwd == "111111") {
                req.session("login", "1");
                return res.redirect("/home");
            }
            res.error("登录失败");

        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })

    return {
        router, middle
    }
}