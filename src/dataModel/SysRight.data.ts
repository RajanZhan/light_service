/**  系统用户权限 */
const Sequelize = require("sequelize");
export default {
    name: "sysRight",
    tableName: "dop_sys_right",
    body: {
        rid: {
            type: Sequelize.STRING(128),
            primaryKey: true,
            //autoIncrement: true
        },
        appId:Sequelize.STRING,// 所属应用的id
        pid:Sequelize.STRING(128),// 上级权限id
        name: {
            type: Sequelize.STRING(128), // 权限名称
        },
        value:Sequelize.STRING(128),// 权限的值
        remark:Sequelize.TEXT,
        sort:Sequelize.INTEGER,// 排序
        status: Sequelize.INTEGER,
    },
    relation:[
        {
            model:"sysRole",
            type: "belongsToMany",
            as: "roles",
            through: "sysRoleRight",
            foreignKey: "rightId"
        }
    ],

    // 创建索引
    indexes: [{
        fields: ['name']
    },
    {
        fields: ['value']
    },
    {
        fields: ['status']
    },
    {
        fields: ['appId']
    }
        // {
        //     type:"FULLTEXT",// 全文索引
        //     fields:["remark"]
        // },
        // {
        //     fields:["tagid_list"] // 普通索引
        // },
    ]
}