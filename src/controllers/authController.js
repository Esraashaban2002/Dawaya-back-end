
const { sendEmail } = require("../config/mailer");
const User = require("../models/User");

// Create new User 
/**
 * 
 * @desc Register user
 * @route POST /api/auth/register 
 */

exports.register = async (req, res) => {
  try {
    const { username, email, password , phone ,gender} = req.body;
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // create user
    const user = new User({
      username,
      email,
      password,
      phone,
      gender,
      otp,
      otpExpire,
    });

    await user.save();

    // send email
    try {
      await sendEmail({
       to: email,
        subject: "Verify your account",
        html: `
          <h2>Your verification code</h2>
          <h1><b>${otp}</b></h1>
          <p>This code will expire in 10 minutes</p>
        `,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Verification code sent to your email",
      email
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 *
 * @desc Verif Email OTP
 * @route POST /api/auth/verify
 */

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({
      email, otp, otpExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    };
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save()

    res.status(200).json({
      success: true,
      message: 'User is verified and can now login'
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'user is not verifed' })
  }
}

// Login User
/**
 *
 * @desc Login user
 * @route POST /api/auth/login
 */

exports.login =async (req, res) => {
  try {
    const {email , password} = req.body
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({success : false , message : 'Invalid email or password'})
    }
    if(!user.isVerified){
       return res.status(401).json({success : false , message : 'please verify your email first'})
    }

    // const deviceInfo = req.headers["user-agent"] || "Unknown Device";
    // const accessToken = await user.generateToken(deviceInfo);

    res.status(200).json({success : true , user, role: user.role });
  } catch (e) {
    res.status(500).json({success : false , message: e.message});
  }
}

// Forget Password 
/**
 *
 * @desc Forget password
 * @route POST /api/auth/forgetpassword
 */

exports.forgetpass =async (req, res) => {
  try {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({success : false , message : 'email not found'})
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.reastPasswordOtp = otp
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.resetPasswordOtpExpire = otpExpire
    await user.save()
    // send email
    try {
      await sendEmail({
       to: email,
        subject: "Verify your account",
        html: `
          <h2>Your verification code</h2>
          <h1><b>${otp}</b></h1>
          <p>This code will expire in 10 minutes</p>
        `,
      });

      res.status(200).json({
      success: true,
      message: "Reast OTP code sent to your email",
      email
    });
    
    } catch (error) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

 
  } catch (e) {
    res.status(500).json({success : false , message: e.message});
  }
}

// Reast Password
/**
 *
 * @desc Reast password
 * @route POST /api/auth/reastpassword
 */

exports.reastpass =async (req, res) => {
  try {
    const {email , otp , password} = req.body
    const user = await User.findOne({
      email,
      resetPasswordOtp : otp,
      resetPasswordOtpExpire : {$gt : Date.now()}
    })

    if(!user){
      return res.status(400).json({success : false , message : 'User not found ,Or Invalid ,Or Expierd otp'})
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save()
    return res.status(200).json({success : true , message: 'Password reast successfully!'})
 
  } catch (e) {
    res.status(500).json({success : false , message: e.message});
  }
}