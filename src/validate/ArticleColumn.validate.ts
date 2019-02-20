export default {
   async checkName(name,uid)
    {
        if(!uid)
        {
            return [false,'添加文章栏目时，uid不能为空']
        }
        let cls = <any> await $model("articleColumn.getColumnsByUid",uid);
        for(let c of cls)
        {
            if(c.name == name)
            {
                return [false,'已经存在同名栏目']
            }
        }
        return [true]
    }
}