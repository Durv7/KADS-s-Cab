const jwt = require("jsonwebtoken");
const Driver = require("../Models/driver.model.js");

const protectDriver=async(req,res,next)=>{

    let token;
    if(req.cookies.kads_token){
        try{
            token = req.cookies.kads_token;

            const decoded=jwt.verify(token,process.env.JWT_TOKEN_SECRET)
            const id = decoded._id;
            

            let user = await Driver.findById(id).select('-password');
            if(!user) return res.status(401).json({message:'Not authorized, token failed'})
            req.user = user;
            next();

        }catch(err){
            res.status(401).json({message:'Not authorized, token failed'})
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
      }
}

module.exports ={protectDriver}