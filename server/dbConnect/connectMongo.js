const {default : mongoose} = require('mongoose')
const dbconnect = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if(conn.connection.readyState ===1 ){
            console.log("Connect successfully")
        }else{
            console.log("Connect failed")
        }
    } catch (error) {
        console.log("db connect failed")
        throw new Error(error)
    }
}
module.exports= dbconnect
