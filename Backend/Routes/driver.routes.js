const express = require("express");
const {registerDriver,loginDriver,logoutDriver}=require("../Controllers/authDriver.controllers.js");
const {validateDriverData}=require("../middlewares/validateSchemas.js")
const {protectDriver} = require("../middlewares/protectDriver.js");

const router = express.Router();

router.post("/signin",validateDriverData,registerDriver);

router.post("/login",loginDriver);

router.get("/logout",protectDriver,logoutDriver);

router.get("/getProfile",protectDriver,(req,res)=>{
    res.status(201).json({message:"Authenticated",username:req.user.userName})
})


module.exports = router;