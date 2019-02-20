{
    const fs = require("fs");
    const path = require("path");
    module.exports = {


        /**
        * 统一输出
        * @param {any}  - 错误信息.
        */
        out(msg) {
            if (typeof msg == 'number') {
                return this.send(`${msg}`);
            }
            this.send(msg);
            //$common.writeLog(log);
        },


        /**
        * 返回服务器错误信息.status 为 500
        * @param {any}  - 错误信息.
        */
        error(msg, log) {
            //this.status(500);
            this.success({ err_code: -1, err_msg: msg })
            //this.out(msg);
            //$common.writeLog(log);
        },

        /**
         * 接口拒绝处理此请求，可能权限不足.status 为 403
         * @param {any}  - 错误信息.
         */
        nauth(msg) {
            this.status(403);
            this.out(msg);
        },

        /**
        * 接口拒绝处理此请求，可能是授权信息不合法.status 为 202 服务器已接受请求，但尚未处理。
        * @param {any}  - 错误信息.
        */
        deny(msg) {
            this.status(202);
            this.out(msg);
        },

        /**
         *提交的信息不合法，请重新修正后再提交.status 为 402
         * @param {any}  - 错误信息.
         */
        stop(msg) {
            // this.status(402);
            // this.out(msg);
            this.success({ err_code: 1, err_msg: msg })
        },

        /**
         * 处理成功.status 为 200
         * @param {any}  - 错误信息.
         */
        success(msg) {
            //this.status(200);
            this.status(200);
            this.out(msg);
        },

        /**
         * 处理成功.status 为 200
         * @param {any}  - 错误信息.
         */
        ok(msg) {
            //this.status(200);
            this.status(200);
            this.success({ err_code: 0, data: msg });
        },

        /**
        * 渲染模板输
        * @param {tpl}  - 模板的名称，无需添加后缀，比如模板index.html，只需要传入index，即可，模板的路径在config.viewPath中定义.
        * @param {data}  - 即将要渲染的数据.
        */
        async display(tp, data) {

            var tpPath = "";
            if ($config.debug == 1) {
                tpPath = path.join(__dirname, "../../../src/" + $config.name + "/", $config.viewPath + "/" + tp + ".html")
            }
            else {
                tpPath = path.join(__dirname, $config.viewPath + "/" + tp + ".html")
            }
            //console.log(tpPath);
            if (!fs.existsSync(tpPath)) {
                let err = `response.js-- display template '${tp}' is not found `;
                console.log(err);
                throw err;
            }
            if ($config.debug == 1) {
                var html = fs.readFileSync(tpPath).toString();
            }
            else {
                var tplKey = `template-${tpPath}`;
                var html = <any>await $cache.get(tplKey);
                if (!html) {
                    html = fs.readFileSync(tpPath).toString();
                    await $cache.set(tplKey, html, $config.cacheDefaultExpire);
                }
            }
            let render = <any>$tp.compile(html);
            if (!data)
                data = {}
            this.out(render(data));
        },


    }
}