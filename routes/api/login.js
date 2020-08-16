let express = require("express");
let router = express.Router();
let bcrypt = require("../../utils/bcrypt")
let mgdb = require("../../utils/mgdb")
let jwt = require("../../utils/jwt")

router.post('/',(req,res,next)=>{
  let {username,password} = req.body;
  if(!username || !password){
    res.send({
      err: 1 ,
      msg: "用户名密码为必传参数"
    })
    return;
  }
  //兜库查询是否用户名密码正确
  mgdb.open({
    collectionName: "user"
  }).then(
    ({collection}) => collection.find({username}).toArray((err,result)=>{
      if(err){
        res.send({err:1,msg:"查询操作失败，超出预期错误",errMsg:err});
        mgdb.close()
      }else{
        if(result.length>0){
          console.log(password)
          console.log(result[0].password)
          let bl = bcrypt.compareSync(password,result[0].password)
          console.log(bl)
          if(bl){
            let token = jwt.sign({username,_id:result[0]._id})
            delete result[0].username;
            delete result[0].password;
            res.send({
              err: 0 ,
              msg: "登录成功",
              data: result[0],
              token
            }
            )
          }else{
            res.send({
              err: 1 ,
              msg: "用户名或者密码有误-2",
            })
          }
        }else{
          res.send({
            err: 1 ,
            msg: "用户名或者密码有误-1",result
          })
        }
        mgdb.close();
      }
    })
  ).catch(
    err=>reject({err:1,msg:'库链接失败-find-list'+err})
  )
})

module.exports=router;