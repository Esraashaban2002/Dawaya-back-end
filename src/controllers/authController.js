
const User = require("../models/User");

/**
 * 
 * @desc Register user
 * @route POST /api/auth/register 
 */

exports.register = async (req, res) => {
  try {
    const {name , email , password} = req.body;
    const userExsit = await User.findOne({email})
    if(!userExsit){
        return  res.status(400).json();
    }
    await user.save();
    res.status(201).send(user);

    try{

    }catch(error){

    }
  } catch (error) {
  return  res.status(500).send(error.message);
  }
}

/**
 * 
 * @desc Verif Email OTP
 * @route POST /api/auth/verify
 */

exports.verifyEmail = async (req, res) => {
  try {
   const {email , otp} = req.body
   const user = await User.findOne({
    email , otp , otpExpire : {$gt : Date().now()}
   });
   if(!user){
    return res.status(400).json({success : false , message : 'Invalid or expired OTP'})
   };
   user.isVerified = true;
   user.otp = undefined;
   user.otpExpire = undefined;
   await user.save()
   res.status(200).json({
    success : true ,
    message : 'user is verifed to login'
   })
  } catch (error) {
    return res.status(500).json({success:false , message: 'user is not verifed'})
}
}

/**
 * 
 * @desc Login user 
 * @route POST /api/auth/login 
 */

exports.login =async (req, res) => {
  try {
    const {email , password} = req.body
    const user = User.findOne({email}).select('+password');
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({success : false , message : 'Invalid email or password'})
    }
    if(!user.isVerified){
       return res.status(401).json({success : false , message : 'please verify your email first'})
    }

    const deviceInfo = req.headers["user-agent"] || "Unknown Device";
    const accessToken = await user.generateToken(deviceInfo);

    res.status(200).json({success : true , user, accessToken, role: user.role });
  } catch (e) {
    res.status(500).json({success : false , message: e.message});
  }
}