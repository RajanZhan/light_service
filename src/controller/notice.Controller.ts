export default (path) => {

    const controller = require("../lib/routerRegister")(path);
    const router = controller.router;

    // 中间件
    function middle(req, res, next) {
        next()
    }
    
    // 添加文章
    controller.post("/add","",async(req:request,res:response)=>{
        try {
            
        } catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    })

    
     // 删除文章
     controller.post("/delete","",async(req:request,res:response)=>{
        try {
            
        } catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    })

    // 更新文章
    controller.post("/update","",async(req:request,res:response)=>{
        try {
            
        } catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    })

    // 读取文章详情  
    controller.get("/get","",async(req:request,res:response)=>{
        try {
            
        } catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    })

    // 读取文章列表 
    controller.get("/list","",async(req:request,res:response)=>{
        try {
            
        } catch (err) {
            let msg = err.message
            $logger.error({ err: err, msg: msg });
            res.error(msg);
        }
    })


    return {
        router,
        middle
    };
}