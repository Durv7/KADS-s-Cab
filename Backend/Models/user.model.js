const mongoose = require("mongoose");
const {Schema}= require("mongoose");

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    phoneNo:{
        type:String,
        minLength:10,
        maxLength:10,
        required:true,
    },
    password:{
        type:String,
        required:true,
        
    }

})

const User = mongoose.model("User",userSchema);

module.exports=User; 