const express=require("express");
const user=require("../Controllers/userController");
const router=express.Router();
router.route('/register').post(user.signup);
router.route('/login').post(user.login);
module.exports=router;