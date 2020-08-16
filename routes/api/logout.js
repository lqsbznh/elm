let express = require("express");
let router = express.Router();


router.get('/',(req,res,next)=>{
  console.log('goods',req.body)
})

module.exports=router;