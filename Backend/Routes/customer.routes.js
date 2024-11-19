const express = require("express");
const {registerCustomer,loginCustomer,logoutCustomer} = require("../Controllers/authCustomer.controllers.js");
const {validateCustomerData}=require("../middlewares/validateSchemas.js")
const { protectCustomer } = require("../middlewares/protectCustomer.js");
const {showProfile,mytrips}=require("../Controllers/customers.controllers.js");

const router = express.Router();

router.post('/temp',(req,res)=>{
    console.log(req.body);
    res.send(req.body);
})

//register route
router.post('/signin',validateCustomerData,registerCustomer);

//login route
router.post('/login',loginCustomer);

//logout route
router.get('/logout',logoutCustomer);

router.get('/getprofile',protectCustomer,showProfile)

router.get('/mytrips',protectCustomer,mytrips);

module.exports = router;