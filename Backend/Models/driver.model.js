const mongoose = require("mongoose");
const {Schema}=require("mongoose");

const driverSchema= new Schema(
    {
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
        },

        fullName:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            default:"kolhapur",
        },
        phoneNo:{
            type:String,
            maxLength:10,
            minLength:10,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minLength:true,
        }
    }
)

const Driver = mongoose.model("Driver",driverSchema);

module.exports = Driver;