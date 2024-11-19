const jwt = require("jsonwebtoken");
const Driver = require("../Models/driver.model.js");
const User = require("../Models/user.model.js");

const isLoggedIn=async(req,res,next)=>{

    let token;
    if(req.cookies.kads_token){
        try{
            token = req.cookies.kads_token;

            const decoded=jwt.verify(token,process.env.JWT_TOKEN_SECRET);
            
            const id = decoded._id;
            
            let driver = await Driver.findById(id).select('-password');
            let customer = await User.findById(id).select('-password');
           
            let user;
            if(driver){
               user= {driver,role:"driver",isLogin:true}
            }else if(customer){
                user={customer,role:"customer",isLogin:true}
            }
            
            req.user = user;
            next();

        }catch(err){
            res.status(401).json({message:'Not authorized, token failed',isLogin:false,error:err})
        }
        
    }
     if (!token) {
        res.status(401).json({ message: 'Not authorized, no token',isLogin:false });
    }


}

module.exports ={isLoggedIn}