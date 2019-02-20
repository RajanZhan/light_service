/**
 * 系统用户相关的方法
 */
import commonBase from "./commonBase.Model"

interface getSysUserByUid {
    uid:string,
    type:string,
}

interface getSysUserByName {
    name:string,
    type:string,
}



export default class extends commonBase {
    
    constructor()
    {
        super();
    }

    // 根据用户id读取系统用户信息
    async getSysUserByUid(data: getSysUserByUid) {
        try {
            if (!data.uid) {
                throw new Error("无法读取用户信息，因为uid为空");
            }

            return await this.$m("sysUser").findOne({
                include: [
                    {
                        as: "roleInfo",
                        model: this.$m("sysRole"),
                        include: {
                            as: "rights",
                            model: this.$m("sysRight"),
                        }
                    },
                    {
                        as: "apps",
                        model: this.$m("sysApp"),
                    }
                ],
                where: {
                    uid: data.uid,
                    type: data.type
                }
            });
        } catch (err) {
            throw err;
        }
    }
    
    // 根据用户id读取系统用户信息
    async getSysUserByName(data: getSysUserByName) {
        try {
            //console.log(data,"读取的参数是");
            interface Cache {
                roleInfo: {
                    rights: [
                        {
                            value: string,
                        }
                    ]
                },
                apps: [
                    {
                        appRight: [
                            {
                                value: string,
                            }
                        ]
                    }

                ],
                setDataValue: (key: string, value: any) => {}
            }
            if (!data.name) {
                throw new Error("无法读取用户信息，因为uid为空");
            }
            let key = `${data.name}-name`;
            let cache = <Cache>await $cache.get(key);
            if (cache) {
                //console.log("from cache ");
                return cache;
            }
            cache = <Cache> await this.model("sysUser").findOne({
                include: [
                    {
                        as: "roleInfo",
                        model: this.$m("sysRole"),
                        include: {
                            as: "rights",
                            model: this.$m("sysRight"),
                        }
                    },
                    {
                        as: "apps",
                        model: this.$m("sysApp"),
                        include: {
                            as: "appRight",
                            model: this.$m("sysRight"),
                        }
                    }
                ],
                $fields:['name','pwd','type','mainId','roleId','status','remark'],
                where: {
                    name: data.name,
                    type: data.type
                }
            });
            
            //return cache;
            //console.log("查询用户",data,cache);
            let right = [];
            // 处理系统权限
            if (cache && cache.roleInfo && cache.roleInfo.rights) {
                for (let r of cache.roleInfo.rights) {
                    if (r.value) {
                        right.push(r.value);
                    }
                }
            }
            if (cache && cache.apps) {
                for (let app of cache.apps) {
                    if (app.appRight) {
                        for (let r of app.appRight) {
                            if (r.value) {
                                right.push(r.value);
                            }
                            //console.log("set app right");
                        }
                    }
                }
            }
            if(!cache)
            {
                return null;
            }
            cache['allRight'] = right;// 统一存放系统权限，方便验证
            $cache.set(key, cache, 5);// 缓存5秒
           // return cache
            return JSON.parse(JSON.stringify(cache));
        } catch (err) {
            throw err;
        }
    }
}