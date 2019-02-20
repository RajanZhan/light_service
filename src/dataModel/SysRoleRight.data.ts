/**  系统用户权限 */
const Sequelize = require("sequelize");
export default {
    name: "sysRoleRight",
    tableName: "dop_sys_role_right",
    body: {
        rrid: {
            type: Sequelize.STRING(128),
            primaryKey: true,
            //autoIncrement: true
        },
        roleId: Sequelize.STRING(128),
        rightId: Sequelize.STRING(128),
    },


    // 创建索引
    indexes: [{
        fields: ['roleId']
    },
    {
        fields: ['rightId']
    },
    // {
    //     fields: ['status']
    // },
    // {
    //     type: "FULLTEXT",// 全文索引
    //     fields: ["remark"]
    // },
    // {
    //     fields: ["tagid_list"] // 普通索引
    // },
    ]
}