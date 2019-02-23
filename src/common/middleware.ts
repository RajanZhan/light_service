/**
 * 引入中间件 在这里引入
 */

// const ueLib = require("../lib/ueditor.js");
// const postXml = require("../middleware/postXml"); //  处理xml 数据 用于微信支付
// const getRealIp = require("../middleware/getRealIp.middle"); // 读取真实的ip地址
// const post = require("../middleware/post.middle");
// var path = require("path");
import tokenMiddle from "../middleware/token.middle"


module.exports = (app) => {
    //app.use("/ueditor/ue", ueditor(path.join(__dirname, 'static'), ueLib));
    // app.use(postXml.middleware);
    // app.use(getRealIp);
    // app.use(post);
    app.use(tokenMiddle);


    // wo wo 
};
