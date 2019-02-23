/**  文章模型（模型编号：DCMTA001，模型名：article） */
const Sequelize = require("sequelize");
export default {
    name: "article",
    tableName: "xiao_qi_article",
    body: {
        id: {
            type: Sequelize.STRING(128),
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING(128), 
            allowNull: false,
            alis:"tlt"
        },
        author: {
            type: Sequelize.STRING(32), 
            allowNull: true,
            alis:"athr"
        },
        tags: {
            type: Sequelize.STRING(32), 
            allowNull: true,
            alis:"athr"
        },
        brief: {
            type: Sequelize.STRING(512), 
            allowNull: true,
            alis:"brief"
        },
        userId: {
            type: Sequelize.STRING(32), 
            allowNull: false,
            alis:"uid"
        },
        columnId: {
            type: Sequelize.STRING(32), 
            allowNull: false,
            alis:"clnid"
        },
        content: {
            type: Sequelize.STRING(32), 
            allowNull: false,
            alis:"cnt"
        },
        createTime: {
            type: Sequelize.DATE, 
            allowNull: false,
            alis:"ctime"
        },
        file: {
            type: Sequelize.STRING(32), 
            allowNull: true,
            alis:"fl"
        },
        status: {
            type: Sequelize.STRING(32), 
            allowNull: false,
            alis:"sts"
        },
    },
    relation: [
        // {
        //     model: "sysUser",
        //     as: "users",
        //     through: "sysUserApp",
        //     foreignKey: "appId",
        //     type: "belongsToMany"
        // }, {
        //     type: "hasMany",
        //     model: "sysRight",
        //     as: "appRight",
        //     targetKey: "appId",
        //     foreignKey: "appId"
        // }
    ],

    // 创建索引
    indexes: [{
        fields: ['title','columnId','status']
    },
    {
        type: "FULLTEXT",// 全文索引
        fields: ["content","tags"]
    },
        // {
        //     fields:["tagid_list"] // 普通索引
        // },
    ]
}