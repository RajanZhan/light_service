/**
 *  这里是controller的核心方法
 * 
 */
var appRights = new Map();
module.exports = (app,controllers)=>{
    for(let key in controllers)
    {
        //console.log(key,controllers[key](key).router.getAppRight());
        let controller = controllers[key](key);
        let right = controller.router.getAppRight()
        if(right )
        {
            for(let r in right)
            {
                if(right[r])
                {
                    for(let rs of right[r])
                    {
                        let rightPath = r + rs.path;
                        appRights.set(rightPath,{
                            rightName:rs.rightName,
                            path:rightPath
                        })
                    }
                }
               
            }
        }
        regGlobal("$appRights",controllers[key](key).router.getAppRight());
        app.use(key,controller.middle,controller.router);
        //console.log("路由注册",key,controller.router);
        //console.log("路由注册",key);
    }
    //regGlobal("$appRights",appRights);
    
}