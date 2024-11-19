
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const rideSchema = new Schema({
    driver:{
        type:Schema.Types.ObjectId,
        ref:"Driver"
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    source:String,
    destination:String, 
    status:{
        type:String,
        default:"requested",
    },

},
    {
        timestamps: true,
    }
)

const Ride = mongoose.model("Ride",rideSchema);

module.exports = Ride;