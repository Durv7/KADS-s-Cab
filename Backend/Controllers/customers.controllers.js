const Ride = require("../Models/ride.model.js");
const showProfile = (req,res)=>{
    console.log(req.cookies);
    res.status(201).json({
        message:"Authenticated",
        username:req.user.userName,
    })
}

const mytrips = async (req,res)=>{
    let id = req.user._id;
    console.log(id);

    let list= await Ride.find({customer:id});

    if(list.length===0){
        res.status(401).json({
            message:"You Haven't Ride Yet"
        })
    }else{
        res.status(201).json(list);
    }
}



module.exports={showProfile,mytrips};