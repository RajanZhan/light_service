/**  应用列表 */
const Sequelize = require("sequelize");
export default {
    name: "sysApp",
    tableName: "dop_sys_app",
    body: {
        id: {
            type: Sequelize.STRING(128),
            primaryKey: true,
            // autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(128), // 名称
        },
        url: {
            type: Sequelize.STRING(256), // 应用地址
            allowNull: false,
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        icon: Sequelize.STRING(258),
        remark: Sequelize.TEXT,
        rtime: Sequelize.DATE,//注册时间
        status: Sequelize.INTEGER,
    },
    relation: [
        {
            model: "sysUser",
            as: "users",
            through: "sysUserApp",
            foreignKey: "appId",
            type: "belongsToMany"
        }, {
            type: "hasMany",
            model:"sysRight",
            as: "appRight",
            targetKey: "appId",
            foreignKey: "appId"
        }
    ],

    // 创建索引
    indexes: [{
        fields: ['name']
    },
    {
        fields: ['status']
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