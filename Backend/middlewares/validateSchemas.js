const {driverSchema,customerSchema} =require("../schema.validate.js");
const {ExpressError}=require("../utils/expressError.js")

const validateCustomerData =(req,res,next)=>{
    let {error}=customerSchema.validate(req.body);

    if(error){
        console.log(error.message);
        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

const validateDriverData =(req,res,next)=>{
    let {error}=driverSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports = {validateCustomerData,validateDriverData}