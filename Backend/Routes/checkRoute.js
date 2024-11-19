const {isLoggedIn} =require("../middlewares/isLoggedIn");
const checkLogin = require("../Controllers/checkLogin.js");
const express = require("express");

const router= express.Router();

router.get("/",isLoggedIn,checkLogin);

module.exports = router;
