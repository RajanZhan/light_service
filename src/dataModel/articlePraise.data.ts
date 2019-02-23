/**  3.文章点赞数量（模型编号：DCMTA002，模型名：articlePraise） */
const Sequelize = require("sequelize");
export default {
    name: "articlePraise",
    tableName: "xiao_qi_article_praise",
    body: {
        id: {
            type: Sequelize.STRING(128),
            primaryKey: true,
        },
        userId: {
            type: Sequelize.STRING(32),
            allowNull: false,
            alis: "uid"

        },
        articleId: {
            type: Sequelize.STRING(32),
            allowNull: false,
            alis: "atclid"
        },
        time: {
            type: Sequelize.DATE,
            allowNull: true,
            alis: "dec"
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
        fields: ['userId', 'articleId']
    },

    ]
}