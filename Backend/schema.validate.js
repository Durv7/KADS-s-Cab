const joi = require("joi");

const driverSchema = joi.object({
    userName:joi.string().required().lowercase().required(),
    email:joi.string().required(),
    phoneNo:joi.string().length(10).required(),
    fullName:joi.string().required(),
    city:joi.string().default("kolhapur"),
    password:joi.string().required(),
})

const customerSchema = joi.object({
    userName:joi.string().required().lowercase().required(),
    email:joi.string().required(),
    phoneNo:joi.string().length(10).required(),
    password:joi.string().required(),
})

module.exports = {driverSchema,customerSchema};