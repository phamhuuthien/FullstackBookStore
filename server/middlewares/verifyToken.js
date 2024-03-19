const jwt = require('jsonwebtoken')
const roleModel = require('../model/role')

const verifyToken = async(req,res,next)=>{
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET,(err,decode)=>{
            if(err) return res.status(401).json({
                success: false,
                mes: 'invalid access token'
            })
            req.user = decode
            next()
        })
    }else{
        return res.status(401).json({
            success: false,
            mes: 'require authotication !!'
        })
    }
}

const isAdmin = async(req,res,next)=>{
    const {role} = req.user
    const roleName = await roleModel.findById(role)
    if(roleName.roleName!=='admin'){
        return res.status(401).json({
            success: false,
            mes: 'required role admin !!'
        })
    } 
    // throw new Error('required role admin')
    next()
}

module.exports ={
    verifyToken,
    isAdmin
}