import sysUser from "../dataModel/SysUser.data"
import sysRole from "../dataModel/SysRole.data"
import sysRight from "../dataModel/SysRight.data"
import sysRoleRight from "../dataModel/SysRoleRight.data"
import sysApp from "../dataModel/SysApp.data"
import sysUserApp from  "../dataModel/SysUserApp.data"

var models = [
	
];


module.exports = async () => {
	//return await require("rajan-datamodel")({
	return await require("rajan_zhan-datamodel")({
		config: {
			"host": $config.db.host,
			"db": $config.db.db,
			"uname": $config.db.uname,
			"pwd": $config.db.pwd,
			//"logging":$config.debug == 1?true:false,
			"logging": false,
		},
		models: models,
	});
	//console.log("db is ",db);
}

