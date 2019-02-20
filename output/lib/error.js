/*  用于错误收集 的工具 */

/**
* 异常收集
* @param {object} err  具体的错误信息
* @param {string} remark  备注 信息
* @returns void. 
*/
module.exports = (err, remark) => {
    console.log("系统发生接收到异常,异常信息，以及备注如下 ",err,remark);
}