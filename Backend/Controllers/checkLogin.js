const jwt = require("jsonwebtoken");
const checkLogin=async (req,res) => {
    let user = req.user;
    
    if(!user)  {
        res.status(201).json({message:"notLoggedIn",isLogin:false})
    }else{
        res.status(201).json({...user});
    };

    
}

module.exports =checkLogin;