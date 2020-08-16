let mongodb = require("mongodb");

let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;

//连接数据库的配置
let  address = "mongodb://127.0.0.1:27017";
let options = {useUnifiedTopology: true}
let sql = "elm";
let connect = null;

//封装开数据库的通道
let open = ({dbName = sql,collectionName,url =address})=> new Promise((resolve,reject)=>{
  if(!collectionName){
      reject({err: 1,msg: "集合名为必传参数"})
      return
  }
  mongoCt.connect(url,options,(err,client)=>{
    if(err){
      reject({err: 1,msg: err})
    }else{
      //client 连接体
      connect = client;
      let db = client.db(dbName);
      let collection = db.collection(collectionName);
      resolve({ collection,ObjectId })
    }
  });
})

let close = ()=> [
  connect && connect.close()
]

let findList = ({
  collectionName,
  dbName = sql,
  _page,_limit,_sort,q
})=> new Promise((resolve,reject)=>{
  if(!collectionName){
    reject({err:1 , msg:"集合名为必传参数"})
    return;
  }
  //定义查询规则
  let rule = q ? {title: eval("/"+ q + "/")} : {};

  //兜库
  open({dbName , collectionName}).then(
    ({collection})=>{
      collection.find(rule,{
        skip: _page * _limit,
        limit: _limit,
        projection:{},
        sort: {[_sort]:-1}
      }).toArray((err,result) =>{
        if(!err && result.length>0){
          resolve({
            err:0,
            msg:"成功",
            data:result
          })
        }else{
          resolve({
            err:1,
            msg:"查无数据",
          })
        }
        close()
      })
    }
  ).catch(
    err => reject({err:1,msg:"find-list，库连接失败"+err})
  )
})

let findDetail = ({
  collectionName,
  dbName = sql,
  _id = null
})=>new Promise((resolve,reject)=>{
  if(!_id){
    reject({err:1,msg: "_id为必穿参数"});
    return;
  }else if(_id.length !== 24){
    reject({err:1,msg: "_id格式不正确（24位）"});
    return;
  }
  open({dbName,collectionName}).then(({collection})=>collection.find({
    _id: ObjectId(_id)
  },{
    projection:{_id:0}
  }).toArray((err,result)=>{
    if(!err && result.length>0){
      resolve({
        err:0,
        msg:"成功",
        data: result[0]
      })
    }else{
      resolve({
        err:1,
        msg:"查无数据"
      })
    }
    close()
  })
  ).catch(
    err=>reject({err:1,msg:"find-detail,库链接失败"+err})
  )
})

exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;
exports.close = close;