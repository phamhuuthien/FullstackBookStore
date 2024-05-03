const jwt = require('jsonwebtoken')


const genderateAccessToken = (uid,role) => jwt.sign({_id :uid,role}, process.env.JWT_SECRET,{expiresIn: "2d"})
const genderateRefreshToken = (uid) => jwt.sign({_id :uid}, process.env.JWT_SECRET,{expiresIn: "5d"})

module.exports = {
    genderateAccessToken,
    genderateRefreshToken
}