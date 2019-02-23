export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    async function middle(req: request, res: response, next) {
        let islogin = await req.session('login');
        if (islogin) {
            return res.rego("/home");
        }
        next()
    }

    controller.get("/", "", async (req: request, res: response) => {
        try {
            res.display("login", {});
        }
        catch (e) {
            $logger.error(e)
            res.error(e.message)
        }
    })
    controller.post("/", "", async (req: request, res: response) => {
        try {
            let name = req.body.name;
            let pwd = req.body.pwd;
            if (!name || !pwd) {
                return res.ok("密码或者账户名不能为空");
            }

            if (name == 'luolaoshi' && pwd == "111111") {
                req.session("login", "1");
                console.log("login ok");
                return res.rego("/home");
            }
            res.error("登录失败");

        }
        catch (e) {
            $logger.error(e.message)
            res.error(e.message)
        }
    })

    return {
        router, middle
    }
}