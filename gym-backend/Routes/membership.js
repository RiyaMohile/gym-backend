const express=require("express")
const router=express.Router();
const MembershipControllers=require("../Controllers/membership");
const auth=require("../Auth/auth")


router.post('/add-membership',auth,MembershipControllers.addMembership)
router.get('/get-membership',auth,MembershipControllers.getMembership)

module.exports=router;