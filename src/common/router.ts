//import article from "../controller/article.Controller"
//import common from "../controller/common.Controller"
import user from "../controller/user.Controller"
//import test from "../controller/test.Controller"
import login from "../controller/login.Controller"
import home from "../controller/home.Controller"
module.exports = {
     "/login":login,
     "/home":home,
     //"/api/common/":common,
     "/api/user/":user,
     //"/api/articleColumn/":articleColumn,
     //'/api/test/':test
}