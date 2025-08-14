const Gym=require('../Modals/gym')
const bcrypt=require('bcryptjs');
const crypto=require("crypto");
const nodemailer=require("nodemailer");
const jwt=require("jsonwebtoken");

exports.register=async(req,res)=>{
    try {
        const {userName,password,email,profilePic,gymName}=req.body;
       
        const isExist=await Gym.findOne({userName});

        if(isExist){
            res.status(400).json({
                error:"username already exist"
            })

        }else{
            const hashPassword=await bcrypt.hash(password,10)
            // console.log(hashPassword)
            const newGym =new Gym({userName, password:hashPassword,email,profilePic,gymName});
            //save in a database
            await newGym.save();

            res.status(201).json({message:"user registered successfully",success:"yes",data:newGym});
        }
        
    } catch (error) {
        res.status(500).json({
            error:"server error"
        })
        
    }
}

//cookie object
const cookiOptions={
    httpOnly:true,
    secure:false,
    sameSite:"Lax"
}

exports.login=async(req,res)=>{
    try {
        const {userName, password}=req.body;
         const Exist=await Gym.findOne({userName})

         if (Exist && await bcrypt.compare(password,Exist.password)){
           //token generate
            const token=jwt.sign({Exist_id:Exist._id},process.env.JWT_SECURITY);
            
            res.cookie("cookie_token",token,cookiOptions)
            
              res.json({message:'logged in successfully', success:"true", Exist,token});
         }
         else{
            res.status(400).json({error:"invalid credentials"});
         }
        
    } catch (error) {
        res.status(500).json({
            error:"server error"
        })
        
    }
}

//for email sending
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

exports.sendOtp=async(req,res)=>{
    try {
        const {email}=req.body
        const gym = await Gym.findOne({email});
        if (gym){

            const buffer = crypto.randomBytes(4);
            const token = buffer.readUInt32BE(0) % 900000 + 100000 
           gym.resetPasswordToken=token;
           gym.resetPasswordExpires=Date.now() + 3600000//1 hr expiry date
           await gym.save();

           //for email sending
           const mailOptions={
            from:"riyamohile88@gmail.com",
            to:email,
            subject:"password Reset",
            text:`You requested a password reset. Your OTP is :${token}`

           };
           transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                res.status(500).json({error:"server error",errorMsg:error});
            }else{
                res.status(200).json({message:"OTP sent to your email"})
            }
           });

        }
        else{
            return res.status(400).json({error:'Gym not found'});
        }
        
    } catch (error) {
        res.status(500).json({
            error:"server error"
        })
        
    }

}

exports.checkOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;
        const gym=await Gym.findOne({
            email,
            resetPasswordToken:otp,
            resetPasswordExpires:{$gt:Date.now()}
        });
        if(!gym){
            return res.status(400).json({error:"Otp is invalid or has expired"});
        }
        res.status(200).json({message:"OTP is successfully verified"})
        
    } catch (error) {
        res.status(500).json({
            error:"server error"
        })
        
    }
}

exports.resetPassword=async(req,res)=>{
try {
    const {email,newPassword}=req.body;
    const gym=await Gym.findOne({email});

    if(!gym){
        return res.status(400).json({error:'some technical issue, please try again later'})
    }
    const hashPassword=await bcrypt.hash(newPassword,10)
    gym.password=hashPassword;
    gym.resetPasswordToken=undefined;
    gym.resetPasswordExpires=undefined;

    await gym.save();
    res.status(200).json({message:"password reset successfully"})
    
} catch (error) {
    res.status(500).json({
        error:"server error"
    })
    
}
}

// exports.checking=(req,res)=>{
//     console.log(req.gym)
// }

exports.logOut=async(req,res)=>{
    res.clearCookie("cookie_token",cookiOptions).json({message:"logged out successfully"});
    
}