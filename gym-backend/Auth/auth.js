const Gym=require("../Modals/gym")
const jwt=require("jsonwebtoken")

const auth=async(req,res,next)=>{
    try {
        //get cookie from the client side (we store cookie in the client side)
        const token =req.cookies.cookie_token;
        if(!token){
            return res.status(401).json({error:"no token,authorization denied"});
        }

        const decode=jwt.verify(token,process.env.JWT_SECURITY);
        // console.log(decode)
        req.gym = await Gym.findById(decode.Exist_id).select('-password');
        next();
        
    } catch (error) {
        res.status(401).json({error:"token is not valid"});
        
    }

}
module.exports=auth;