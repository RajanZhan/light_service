/**  系统用户  */
const Sequelize = require("sequelize");
export default {
    name: "sysUser",
    tableName: "dop_sys_user",
    body: {
        uid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(128),
        },
        pwd: {
            type:Sequelize.STRING(64),
        },
        type: {
            type: Sequelize.STRING(128),// 账户类型 main,sub
        },
        mainId: {
          type:  Sequelize.INTEGER,
        },// 主账号id，如果type为sub会检测该字段
        // 权限id
        roleId: {
            type:Sequelize.INTEGER
        },
        ctime: {
            type:Sequelize.DATE,
        },// 日期 
        remark: {
            type:Sequelize.TEXT,
        },// 备注
        status: {
            type:Sequelize.INTEGER
        },

    },
    relation: [
        {
            model:"sysRole",
            as: "roleInfo",
            foreignKey: "roleId", //wuid mainTableId
            targetKey: "rid",
            type:"belongsTo"
        },
        {
            model:"sysApp",
            as: "apps",
            through:"sysUserApp",
            foreignKey: "uid", 
            type:"belongsToMany"
        }
    ],

    // 创建索引
    indexes: [{
        fields: ['roleId']
    },
    {
        fields: ['mainId']
    },
    {
        fields: ['type']
    },
    {
        fields: ['status']
    },
    ]
}