const express = require('express')
require('dotenv').config();
const app = express();
const initRoute = require('./routes')
const port = process.env.PORT || 8888;
const dbconnect = require('./dbConnect/connectMongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const methodOverride = require('method-override');
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended : true}))

app.use(methodOverride('_method'));

app.get("/",(req,res)=>{
  return res.render('index')
})
app.get('/about', function(req, res) {
  res.render('about');
});
app.get('/books', function(req, res) {
  res.render('books');
});
app.get('/library', function(req, res) {
  res.render('library');
});
app.get('/contact', function(req, res) {
  res.render('contact');
});
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Đổi lại địa chỉ của trang web của bạn
//     credentials: true, // Cho phép sử dụng cookie
//   })
// );

// express hiểu được file json
app.use(express.json());
app.use(cookieParser());
// đọc được file từ client gửi lên
// app.use(express.urlencoded({extended : true}))

dbconnect()

initRoute(app)


app.listen(port,()=>{
    console.log("listening on port 8000")
})
