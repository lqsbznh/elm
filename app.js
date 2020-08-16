var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();


// 安装中间件
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//分发到不同的位置
let multer = require("multer")
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.includes('user') || req.url.includes("reg")){
      cb(null,path.join(__dirname,"public","upload","user"))
    }else if(req.url.includes("banner")){
      cb(null,path.join(__dirname,"public","upload","banner"))
    }else{
      cb(null,path.join(__dirname,"public","upload","product"))
    }
  }
})
let objMulter = multer({ storage});

app.use(objMulter.any())

//静态托管
app.use(express.static(path.join(__dirname, 'public',"template")));
app.use("/bulala",express.static(path.join(__dirname, 'public',"admin")));
app.use(express.static(path.join(__dirname, 'public')));
//node端
let cors = require('cors');

app.use(cors({
  //允许所有前端域名
  "origin": ["http://localhost","http://localhost:5000","http://localhost:8080"],  
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization',"token"]//被允许的post方式的请求头
}));
//客户端接口
app.all('/api/*',require('./routes/api/params'));
app.use('/api/goods', require("./routes/api/goods"));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/user', require('./routes/api/user'));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;