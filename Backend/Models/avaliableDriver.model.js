const mongoose = require("mongoose");
const {Schema}=require("mongoose");

const avaliableDriversSchema = new Schema({
    socketId:{
      type:String,
      unique:true
    },
    identity:{
        type:Schema.Types.ObjectId,
        ref:"Driver"
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates:[Number]
    },
    available: { type: Boolean, default: true },
})

const AvaliableDriver = mongoose.model("AvaliableDriver",avaliableDriversSchema);

module.exports = AvaliableDriver;