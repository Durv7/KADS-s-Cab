const mongoose = require("mongoose");
const connectDB =(uri)=>{
    mongoose.connect(uri).then((res)=>{
        console.log("DB Connectd");
    }).catch((err)=>{
        console.error(err);
    })
}

module.exports={connectDB};