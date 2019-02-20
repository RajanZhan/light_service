console.log("快捷工具...");
let arr = process.argv;
let mode = arr[2];
let param = arr[3];
let force = arr[4]; // 是否强制生成
const fs = require('fs');
const path = require('path');
const jsonmini = require("jsonminify");
var config = JSON.parse(jsonmini(fs.readFileSync(path.join(__dirname, "./config.json")).toString()));


if (mode == '?') {

} else if (!mode) {
    return console.error("参数不合法");
}
// else 
// {
//     console.log(mode,param);
//     return console.error("未知错误");
// }

function createCrud(modelName) {
    let models = fs.readdirSync("./dataModel");
    let dmodelmap = new Map();
    for (let p of models) {
        let pathtmo = "./dataModel/" + p
        let stat = fs.statSync(pathtmo);
        if (stat.isFile()) {

            let m = require(pathtmo);
            if (m.default) {
                //console.log(m.default.name);
                dmodelmap.set(m.default.name, m.default);
            }
        }
    }

    let model = dmodelmap.get(modelName);
    if (!model) {
        return console.error("数据模型  " + modelName + " 不存在，无法创建curd");
    }

    //检测controller，logic  model 是否存在，如果存在 需报警提示

    // model 检测并生成
    let modelOutFilePath = path.join(__dirname, "../../src/" + config.name + "/model/" + model.name + ".Model.ts")
    let existModel = fs.existsSync(modelOutFilePath);
    if (force || !existModel) {
        // 创建model 
        let str = `
        import { BaseModel } from "../lib/Base.Model"
        export class ${model.name} extends BaseModel {
            opt: object;
        
            constructor(opt: object) {
                super();
                this.opt = opt;
            }

            /**
    * 默认首先的执行的方法 
    * @param action  调用的方法
    * @param params  对应的参数
    */
    async _init(action, params) {
        return params;
    }

    /**
     * 根据id查询
     * @param data
     * @return array
    */
    async get(data: any) {
        try {
            if (!data || !data.id) {
                throw new Error('id is empty in article model in get function')
            }
            data.where = {
                id:data.id
            }
            let res = await this.model("${model.name}").findOne(data);
            return res;
        }
        catch (err) {
            throw err
        }
    }


    /**
     * 读取列表
     * @param data {page,psize} 
     * @return array
    */
    async list(data: any) {
        try {
            if (!data) {
                throw new Error('data is empty in article model in list function')
            }
            let res = await this.model("${model.name}").findAll(data);
            return res;
        }
        catch (err) {
            throw err
        }
    }

          
         
          /**
      * 增加
      * @param data any
      * @return array
     */
    async add(data: any) {
        try {
            if (!data) {
                throw new Error('data is empty in article model in add function')
            }
            let primaryKey = <any>$modelPrimaryKeyMap.get("${model.name}");
            if (!primaryKey) {
                throw new Error("模型主键查询失败，${model.name}.Model.add ");
            }
            data[primaryKey.vfield] = $common.getId(); // 主键
            data.sts = 1;
            data.ct = new Date();
            let res =  await this.model("${model.name}").create(data);
            return res;
        }
        catch (err) {
            throw err
        }
    }


        
          /**
      * 修改
      * @param data any
      * @return array
     */
    async update(data: any) {
        try {
           
            let primaryKey = <any>$modelPrimaryKeyMap.get("${model.name}");
            if (!primaryKey) {
                throw new Error("模型主键查询失败，${model.name}.Model.update ");
            }

            if (!data || !data[primaryKey.vfield]) {
                throw new Error('data or 主键  is empty in ${model.name} model in update function')
            }
            let where = {};
            where[primaryKey.realField] = data[primaryKey.vfield]
            let res = await this.model("${model.name}").update(data,{
                where:where
            });;
            return res;
        }
        catch (err) {
            throw err
        }
    }


          /**
      * 删除
      * @param data
      * @return array
     */
    async delete(data: any) {
        try {
            let primaryKey = <any>$modelPrimaryKeyMap.get("${model.name}");
            if (!primaryKey) {
                throw new Error("模型主键查询失败，${model.name}.Model.delete ");
            }
            
            if (!data || !data[primaryKey.vfield]) {
                throw new Error('data or 主键  is empty in article model in delete function')
            }
            let where = {};
            where[primaryKey.realField] = data[primaryKey.vfield]
            let res = await this.model("${model.name}").destroy({
                where:where
            });;
            return res ;
            
        }
        catch (err) {
            throw err
        }
    }


        }
        `
        fs.writeFileSync(modelOutFilePath, str);
        console.log(`创建 ${model.name} model 成功`)
    } else {
        console.log(`${model.name} model 已经存在`);
    }


    // logic 检测并生成
    let logicOutFilePath = path.join(__dirname, "../../src/" + config.name + "/logic/" + model.name + ".Logic.ts")
    let existLogic = fs.existsSync(logicOutFilePath);
    if (force || !existLogic) {
        // 创建model 
        let str = `
        import BaseLoigc from "../lib/Base.Logic"
var Logic = {

    /** 系统预制变量 start */
    AUTH: {},
    setAuthInfo: null,
    getAuthInfo: null,
    /** 系统预制变量 end */


    /** 读取单条信息 */
    async get(data) {
        await $logic([
            {
                data:"id",
                require:true,
                msg:"${model.name} id不能为空"
            }
        ],data)
        return await $model("${model.name}.get",data);
    },

    /** 读取列表 */
    async list(data) {
        
        await $logic([
            
        ],data)
        return await $model("${model.name}.list",data);
    },

    /** 添加数据 */
    async add(data) {
        
        await $logic([
            
        ],data)
        return await $model("${model.name}.add",data);
    },

    /** 修改数据 */
    async update(data) {
        
        await $logic([
            {
                data:"id",
                require:true,
                msg:"${model.name} id不能为空"
            }
        ],data)
        return await $model("${model.name}.update",data);
    },

    /** 删除数据 */
    async delete(data) {
        
        await $logic([
            {
                data:"id",
                require:true,
                msg:"${model.name} id不能为空"
            }
        ],data)
        return await $model("${model.name}.delete",data);
    },
}

Logic.AUTH = {}
Logic.setAuthInfo = BaseLoigc.setAuthInfo;
Logic.getAuthInfo = BaseLoigc.getAuthInfo;
export default Logic

        `
        fs.writeFileSync(logicOutFilePath, str);
        console.log(`创建 ${model.name} logic 成功`)
    } else {
        console.log(`${model.name} logic 已经存在`);
    }


    // 生成控制器

    let controllerOutFilePath = path.join(__dirname, "../../src/" + config.name + "/controller/" + model.name + ".Controller.ts")
    let existController = fs.existsSync(controllerOutFilePath);
    if (force || !existController) {
        // 创建controller 
        let str = `
        export default (path) => {
    
            const controller = require("../lib/routerRegister")(path);
            const router = controller.router;
        
            // 中间件
            function middle(req, res, next) {
                next()
            }

            // get by id 
            controller.get("/get", "读取${model.name}详细数据", async (req, res) => {
                try {
                    let result = await $lg("${model.name}.get", req.query);
                    res.success(result)
                }
                catch (err) {
                    let msg = err.message
                    $logger.error({ err: err, msg: msg });
                    res.error(msg);
                }
            });

            // get list 
            controller.get("/list", "读取${model.name}列表数据", async (req, res) => {
                try {
                    let result = await $lg("${model.name}.list", req.query);
                    res.success(result)
                }
                catch (err) {
                    let msg = err.message
                    $logger.error({ err: err, msg: msg });
                    res.error(msg);
                }
            });

            // add
            controller.post("/add","添加${model.name}单条数据", async (req, res) => {
                try {
                    let result = await $lg('${model.name}.add', req.body);
                    res.success(result);
                }
                catch (err) {
                    let msg = err.message
                    $logger.error({ err: err, msg: msg });
                    res.error(msg);
                }
            });

            // update
            controller.post("/update","修改${model.name}数据", async (req, res) => {
                try {
                    let result = await $lg('${model.name}.update', req.body);
                    res.success(result);
                }
                catch (err) {
                    let msg = err.message
                    $logger.error({ err: err, msg: msg });
                    res.error(msg);
                }
            });


            // delete
            controller.post("/delete","删除${model.name}数据", async (req, res) => {
                try {
                    let result = await $lg('${model.name}.delete', req.body);
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
        `
        fs.writeFileSync(controllerOutFilePath, str);
        console.log(`创建 ${model.name} controller 成功`)
    } else {
        console.log(`${model.name} controller 已经存在`);
    }

    //console.log("一键生成curd");

    // let stat = fs.statSync(from);
    // if (stat.isFile()) {
    //     let to = path.join(__dirname, path1.replace('src', 'out'));
    //     // 创建读取流
    //     let readable = fs.createReadStream(from);
    //     // 创建写入流
    //     let writable = fs.createWriteStream(to);
    //     // 通过管道来传输流
    //     readable.pipe(writable);
    //     console.log("文件同步..");
    //     // console.log(from, to)
    //     // console.log(path.join(__dirname, path1));
    // }
}

switch (mode) {
    case "?":
        console.log(`
         操作名[?,curd,] 参数[,模型名,]
        `)
        break;
    case "curd":
        createCrud(param)
        break;
}
//console.log("操作成功");