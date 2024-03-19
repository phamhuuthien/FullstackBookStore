const express = require('express')
require('dotenv').config();
const app = express();
const initRoute = require('./routes')
const port = process.env.PORT || 8888;
const dbconnect = require('./dbConnect/connectMongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');



app.use(cors({
    origin: 'http://127.0.0.1:5500', // Đổi lại địa chỉ của trang web của bạn
    credentials: true // Cho phép sử dụng cookie
  }));

// express hiểu được file json
app.use(express.json());
app.use(cookieParser());
// đọc được file từ client gửi lên
app.use(express.urlencoded({extended : true}))

dbconnect()

initRoute(app)


app.listen(port,()=>{
    console.log("listening on port 8000")
})
