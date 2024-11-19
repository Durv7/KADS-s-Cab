const jwt =require("jsonwebtoken");
const ExpressError = require("../utils/expressError.js")
const verifyToken = (token,callback)=>{
    jwt.verify(token,process.env.JWT_TOKEN_SECRET,(err,decode)=>{
        if(err) {
            callback(err,null);
        }else{
            callback(null,decode);
        }
    })
}

module.exports = verifyToken;