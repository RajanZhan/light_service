/**  栏目模型（模型编号：DCMTC001，模型名：column） */
const Sequelize = require("sequelize");
export default {
    name: "column",
    tableName: "xiao_qi_column",
    body: {
        id: {
            type: Sequelize.STRING(128),
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(128),
            allowNull: false,

        },
        value: {
            type: Sequelize.STRING(32),
            allowNull: false,
            alis: "vlu"
        },
        desc: {
            type: Sequelize.STRING(512),
            allowNull: true,
            alis: "dec"
        },

        status: {
            type: Sequelize.STRING(2),
            allowNull: false,
            alis: "sts"
        },
    },
    relation: [
        {
            model: "article",
            as: "articles",
            targetKey: "id",
            foreignKey: "columnId",
            type: "hasMany"
        }, 
        //{
        //     type: "hasMany",
        //     model: "sysRight",
        //     as: "appRight",
        //     targetKey: "appId",
        //     foreignKey: "appId"
        // }
    ],

    // 创建索引
    indexes: [{
        fields: ['name', 'value']
    },

    ]
}