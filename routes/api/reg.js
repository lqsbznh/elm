let express = require("express");
let router = express.Router();
let fs = require("fs")
let pathLib = require("path")
let mgdb = require("../../utils/mgdb")
let bcrypt = require("../../utils/bcrypt")



router.post('/',(req,res,next)=>{
  
  //校验 + 入口
  let {username , password ,nikename} = req.body;
  if(!username || !password){
    res.send({err:1,msg:'用户名密码为必传参数'});
    return;
  }
  nikename = nikename || "默认ID";
  //粉丝 关注数
  let follow = 0;
  let fans = 0;
  let time = Date.now();//注册时间服务器生成
  
  let icon = require("../../config/global").normal
  //给头像改名
  if(req.files && req.files.length>0){
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
      )
    icon = `${require("../../config/global").user.uploadUrl}${req.files[0].filename + pathLib.parse(req.files[0].originalname).ext}`
  }
  mgdb.open({collectionName:"user"})
  .then(
    ({collection})=>collection.find({username}).toArray((err,result)=>{
      if(err){
        res.send({err: 1,msg: "集合操作失败"})
        mgdb.close()
      }else{
        if(result.length>0){
          if(!icon.includes("default.gif")){
           fs.unlinkSync("./public" + icon) 
          }
          res.send({err:1,msg:"用户名已存在"})
          mgdb.close()
        }else{
          password = bcrypt.hashSync(password)
          console.log(username,password,nikename,fans,follow,time,icon)
          collection.insertOne({
            username,password,nikename,fans,follow,time,icon
          },(err,result)=>{
            if(!err){
              delete result.ops[0].username
              delete result.ops[0].password
              res.send({err:0,msg:"注册成功",data:result})
            }else{
              res.send({err:1,msg:"集合操作失败-reg2",ss:err})
              console.log(err)
            }
            mgdb.close()
          })
        }
      }
    })
  )
})

module.exports=router;