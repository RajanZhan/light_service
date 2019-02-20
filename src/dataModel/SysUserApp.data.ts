/**  应用列表 */
const Sequelize = require("sequelize");
export default {
    name: "sysUserApp",
    tableName: "dop_sys_user_app",
    body: {
        id: {
            type: Sequelize.STRING(128),
            primaryKey: true,
            //autoIncrement: true
        },
        uid: {
            type: Sequelize.INTEGER, // 用户id
            allowNull: false,
        },
        appId: {
            type: Sequelize.STRING(128), // userId
            allowNull: false,
        },
    },
    relation: [
        {
            type:"belongsTo",
            as: "appInfo",
            targetKey: "appId",
            foreignKey: "appId",
            model: "sysApp",
        }
    ],

    // 创建索引
    indexes: [{
        fields: ['uid']
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