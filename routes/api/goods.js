let express = require("express");
let router = express.Router();
let mgdb = require('../../utils/mgdb')
router.get('/:goodsname',(req,res,next)=>{
  if(req.query._id){
    res.redirect(`/api/goods/${req.params.goodsname}/${req.params._id}`);
    return
  }
  //查询列表
  let collectionName = req.params.goodsname;
  let {_page , _limit , _sort ,q} = req.query;
  
  mgdb.findList({
    collectionName , _page ,_limit ,_sort ,q
  }).then(
    result => res.send(result)
  ).catch(
    err => res.send(err)
  )
})
  
router.get('/:goodsname/:_id',(req,res,next) => {
  let collectionName = req.params.goodsname;
  let _id = req.params._id;

  mgdb.findDetail({collectionName,_id}).then(
    result => res.send(result)
  ).catch(
    err => res.send(err)
  )
})

module.exports=router;