declare const require: any;
declare const module: any;
declare const __dirname: any;
// common 对象
declare var $common: {
    name: 12,
    getname: () => {},
    getRandomString: () => {},
    isArray: (arr: any) => {},
    md5: (str: string) => {},
    getClientIP: (req: any) => {},

    // 格式化时间 "yyyy-MM-dd hh:mm:ss" 
    dateFormate: (date: Date, fmt: string) => {},

    getPageForSql: (page: number, psize: number) => {},
    getId: () => {},
    getRandomNum: (size: number) => {},

    //获取对象的数据数据
    getType(): {
        isArray: (o: any) => {},
        isNumber: (o: any) => {},
        isObject: (o: any) => {},
        isBoolean: (o: any) => {},
        isString: (o: any) => {},
        isUndefined: (o: any) => {},
        isNull: (o: any) => {},
        isFunction: (o: any) => {},
        isRegExp: (o: any) => {}
    }
}
// req 全局对象
declare var $req: {
    session: (key: string) => {},
    dsession: (key: string) => {},
    $dopAuth: {
        userInfo: {
            uid: number,
            allRight: []
        },

    },
    $ip: string,
}

declare var $logger: {
    error: (err: object) => {}
}

// 配置文件
declare var $cache: {
    get: (key: string) => {},
    set: (key: string, value: any, time?: number) => {},
    delete: (key: string) => {},
    expire: (key: string, time: number) => {},
}

declare var $commonCache: {
    get: (key: string) => {},
    set: (key: string, value: any, time?: number) => {},
    delete: (key: string) => {},
    expire: (key: string, time: number) => {},
}

declare var $logic: (task: Array<any>, data: object) => {

}
declare var $dataChecker: (task: Array<any>, data: object) => {
}

// 模板编译变量
declare var $tp: any



declare var $config: {
    debug: number,
    name: string,
    type: string,
    noAuthPath: [],
    authPath: [],
    cacheDefaultExpire: number,//默认缓存时间
    pagination: {
        page: number,
        psize: number,
    },
    msServer: {
        zkHost: string,
        msPort: number,
        servers: {},// 需要注册的服务
    },
    msClient: {
        zkHost: string,
    },
    db: {
        db: string,
        host: string,
        uname: string,
        pwd: string,
    },

    viewPath: string,// 模板引擎的路径

    dopApiExpire: number,// 系统的默认过期时间
    registerAppSecret: string,
    debugAuth: {},
    host: string,
    port: string,
    appRegister: {
        use: number,
        "serverName": string,// 注册地址
        "secret": string,// 注册token
        "appName": string,// 应用名称
        "icon": string// 应用图标  
        url: string,
        desc: string,
    },
    // 短信验证的配置
    smsConfig: {
        sid: string,
        token: string,
        appId: string,
    },

    // vip token 相关配置
    vipToken: {
        expire: number
    },
}

declare var $appRights: {
    keys: () => {

    },
    get: (r: any) => {}

}// 应用权限

// 微服务客户端
interface msClient {
    interfaceName: string,
    actionName: string,
    params?: any
}
//import {msClient} from "../lib/microClient"
declare var $msClient: (obj: msClient) => {}

// 全局变量注册
declare var regGlobal: (name: string, params: any) => {}

// 所有逻辑类的缓存
declare var $logicClass: any
declare var $lg: (name: string, params?: any) => {}

//新逻辑调用方法
declare var $lgc: (name: string, req: any, params?: any) => {}

declare var $model: (name: string, params?: any) => {}
declare var $mdl: (name: string, logic: any, params?: any) => {}

declare var $build: {
    logic: any,
    model: any,
}

// 全局主账号 信息
declare var $mainUserInfo: {
    uid: number,
    allRight: [],// 所有权限
}

// 数据模型字段映射全局变量 虚拟映射真实 
declare var $modelFieldMap: {
    get: (key: any) => {}
}

// 数据模型字段映射全局变量 真实映射虚拟
declare var $realFieldToVfieldMap: {
    get: (key: any) => {}
}

// 模型主键缓存
declare var $modelPrimaryKeyMap: {
    get: (key: any) => {}
}

// 数据库对象
declare var $db: {
    models: [],
    transaction: (t: any) => {},
}


/***
 * 系统接口，http 请求对象
 */
declare interface request {

    query: any,
    body: any,

     /**
    * 设置session
    * @param key 
    * @param value
    */
    session:(key, value?)=>{

    }

     /**
    * 删除session
    * @param key 
    */
    dsession:(key)=>{

    }

    // 授权数据对象
    $dopAuth: {

        // 角色信息
        roleInfo: {
            // 拥有的权限
            rights: [
                {
                    value: string,
                }
            ]
        },
        // 拥有的app
        apps: [
            {
                // 对应APP的权限
                appRight: [
                    {
                        value: string,
                    }
                ]
            }

        ],
        setDataValue: (key: string, value: any) => {}
    },

    $ip: string,// 请求客户端的ip地址
}



/***
 * 系统接口，http 返回对象
 */
declare interface response {

    /**
    * 输出格式化json数据 数据结构为 {err_code:0,data:数据对象}
    * @param obj 数据对象
    */
    ok: (obj: any) => {
    },

    /**
     * 输出模板数据
     * @param tplName 模板的摸名，不含html后缀
     * @param data 数据对象 
     */
    display: (tplName: string, data: any) => {
    },

    /**
    * 向请求端输出错误信息
    * @param obj 错误对象 输出的格式为 {err_code:0,data:obj}
    */
    error: (obj: any) => {
    }

    /**
    * 向请求端输出 中断处理信息 
    * @param msg 错误对象 输出的格式为 {err_code:-1,data:msg}
    */
    stop: (msg: any) => {
    }

    /**
     * 重定向
     * @param url 重定向的地址
     * @param code 301 永久重定向   302 临时重定向
     * 
     */
    rego:(url:any,code?:number)=>
    {

    }

}

