const User=require("../Models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");

const generateToken= (id)=>{
    return jwt.sign({
        _id:id,
        role:'customer',
    },
    process.env.JWT_TOKEN_SECRET,
    {expiresIn:'30d'}
    )
}

const setToken = (res,token)=>{
    res.cookie('kads_token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // Use secure flag in production
        sameSite:'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
}

const registerCustomer = async(req,res)=>{

    const {userName,email,phoneNo,password}=req.body;
    console.log("Request Body:\n",req.body);
    
    let userExists = await User.findOne({userName});
    if(userExists){
       return  res.status(400).json({message:"username already exists"});
    }

      // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        userName,
        email,
        password: hashedPassword,
        phoneNo,
      });

    if (user) {
      const token = generateToken(user._id);
      setToken(res, token); // Set JWT in a cookie
      res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNo:user.phoneNo,
      });
    }else{
       return res.status(400).json({message:"Invalid user data"});
    }
}

const loginCustomer = async(req,res)=>{

    const {userName,password}=req.body;

    if(!userName ||  !password){
        res.status(400).json({message:"please provide all feilds"});
    }

    const user = await User.findOne({userName});

    if(user && (await bcrypt.compare(password,user.password))){
        let token = generateToken(user._id);
        setToken(res,token)
        console.log("here");
        res.status(201).json({
            _id:user._id,
            userName:user.userName,
            email:user.email,
            phoneNo:user.phoneNo,
        
        })

    }else{
        res.status(400).json({message:"Invalid username or password"});
    }

}

const logoutCustomer = async(req,res)=>{
    res.clearCookie('kads_token');
    res.json({message:"logout successfully"}); 
}

module.exports={registerCustomer,loginCustomer,logoutCustomer};