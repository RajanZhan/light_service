/**  系统用户角色  */
const Sequelize = require("sequelize");
export default {
    name: "sysRole",
    tableName: "dop_sys_role",
    body: {
        rid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sysUid: Sequelize.INTEGER,//系统账户id，主要区分为哪些权限是哪些用户的
        name: {
            type: Sequelize.STRING(128),
        },
        remark: Sequelize.TEXT,
        status: Sequelize.INTEGER,
    },
    relation: [
        {
            model:"sysRight",
            type: "belongsToMany",
            as: "rights",
            through: "sysRoleRight",
            foreignKey: "roleId"
        }
    ],

    // 创建索引
    indexes: [{
        fields: ['name']
    },
    ]
}