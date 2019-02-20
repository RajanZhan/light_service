function getKey (key)
{
    return `${$config.name}-${key}`
}

module.exports = async ()=> {
    const redis = await require("./redis")();
    if($config.redis.use != 1) throw "无法启用缓存，请先开启redis功能";
    if(!redis) throw "redis 实例获取失败";
    

    return {
         async get(key){
             try{
                 key = getKey(key);
                 let value = await redis.getSync(key);
                 return  JSON.parse(value) ;
             }
             catch(err)
             {
                 throw err;
             }
        },
        async set(key,value,expire){
             try{
                if((!key) || (!value)){
                    return null;
                }
                key = getKey(key);
                value = JSON.stringify(value);
                if(expire){
                    return await redis.setexSync(key,expire,value);
                }
                else
                {
                    return await redis.setSync(key,value);
                }
             }
             catch(err){
                 throw err;
             }
        },

        async expire(key,expire){
            try{
               if((!key) || (!expire)){
                   return null;
               }
               key = getKey(key);
               return await redis.expire(key,expire);
            }
            catch(err){
                throw err;
            }
       },

        async delete(key){
            try{
                if(!key) return null;
                key = getKey(key);
                return await redis.deleteSync(key);
             }
             catch(err){
                 throw err;
             }
        },
    }
}
