export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    function middle(req, res, next) {
        next()
    }


    controller.get('/test','',async (req:request,res:response)=>{
        res.ok({name:"ok"});
    })


    return {
        router,
        middle
    };
}
