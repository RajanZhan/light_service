export default {


    async  checkArticleColumn(cid) {
        let cinfo = <any>await $model("articleColumn.get", cid);
        if (!cinfo)
            return [false, '该文章栏目不存在']
        if ($mainUserInfo.uid != cinfo.uid) {
            console.log($mainUserInfo,cinfo);
             return [false, '该栏目不属于当前账号']
             }

        return [true]

    }
}