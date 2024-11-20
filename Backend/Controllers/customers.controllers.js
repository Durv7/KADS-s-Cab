const Ride = require("../Models/ride.model.js");
const showProfile = (req,res)=>{
    
    res.status(201).json({
        message:"Authenticated",
        username:req.user.userName,
    })
}

const mytrips = async (req,res)=>{
    let id = req.user._id;
    try{

        let list= await Ride.find({customer:id});

        if(list.length===0){
            res.status(401).json({
                message:"You Haven't Ride Yet"
            })
        }else{
            res.status(201).json(list);
        }
    }catch(err){
        console.log(err);
    }

}



module.exports={showProfile,mytrips};