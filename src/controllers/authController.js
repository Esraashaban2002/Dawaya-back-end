
const { sendEmail } = require("../config/mailer");
const User = require("../models/User");
const { generateToken } = require("../util/generateToken");
const PharmacyRequest = require('../models/PharmacyRequest');

const {
  successResponse,
  errorResponse,
} = require('../util/response');
// Create new User 
/**
 * 
 * @desc Register user
 * @route POST /api/auth/register 
 */

exports.register = async (req, res) => {
  try {
    const { username, email, password , phone ,gender} = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return errorResponse(res , 400 , "هذا البريد الإلكتروني مستخدم بالفعل");
    };

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
      otpExpire
    });

    
    // send email
    try {
      console.log("send email");
      await sendEmail({
        to: email,
        subject: "Verify your account",
        html: `
        <h2>Your verification code</h2>
        <h1><b>${otp}</b></h1>
        <p>This code will expire in 10 minutes</p>
        `
      });
    } catch (error) {
      return errorResponse(res , 500 , error.message);
    };

    await user.save();
    
    successResponse(res , 201 , "تم إرسال كود التحقق إلى بريدك الإلكتروني" , email);
 
  } catch (error) {
    return errorResponse(res ,500, error.message);
  };
};

// verify Email
/**
 *
 * @desc Verify Email OTP
 * @route POST /api/auth/verify
 */

exports.verifyEmail = async (req, res) => {
  try {
    const {otp} = req.body;
    const user = await User.findOne({
       otp, otpExpire: { $gt: Date.now() }
    });
    if (!user) {
      return errorResponse(res ,400, 'كود التحقق غير صحيح أو انتهت صلاحيته');
    };
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    successResponse(res, 200, 'تم تفعيل الحساب بنجاح، يمكنك تسجيل الدخول الآن' );

  } catch (error) {
    return errorResponse(res , 500 , 'user is not verifed');
  };
};

// Login User
/**
 *
 * @desc Login user
 * @route POST /api/auth/login
 */

exports.login =async (req, res) => {
  try {
    const {email , password} = req.body;
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.comparePassword(password))){
        return errorResponse(res , 401 , 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    };
    if(!user.isVerified){
       return errorResponse(res , 401 , 'يرجى تفعيل البريد الإلكتروني أولاً');
    };

    const deviceInfo = req.headers["user-agent"] || "Unknown Device";
    const accessToken = await generateToken(user , deviceInfo);

    user.password = undefined;

    successResponse(res ,200, "تم تسجيل الدخول بنجاح" , {accessToken , user} );
  } catch (e) {
    errorResponse(res ,500, error.message);
  };
};

// Forget Password 
/**
 *
 * @desc Forget password
 * @route POST /api/auth/forgetpassword
 */

exports.forgetpassword =async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return errorResponse(res , 404 , 'البريد الإلكتروني غير موجود');
    };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();
    // send email
    try {
      await sendEmail({
       to: email,
        subject: "Verify your account",
        html: `
  <h2>Password Reset Request</h2>
  <p>We received a request to reset your password.</p>
  <p>Your verification code is:</p>
  <h1 style="color:#2E86C1;"><b>${otp}</b></h1>
  <p>This code will expire in <b>10 minutes</b>.</p>
  <p>If you didn't request this, please ignore this email.</p>
`
      });

      successResponse(res , 200, "تم إرسال كود إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" , email );
    
    } catch (error) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined
      return errorResponse(res , 500, error.message);
    };

 
  } catch (e) {
    errorResponse(res , 500, error.message);
  };
};

// Reast Password
/**
 *
 * @desc Reast password
 * @route PUT /api/auth/reastpassword
 */

exports.resetPassword =async (req, res) => {
  try {
    const {email , password , otp} = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOtp : otp,
      resetPasswordOtpExpire : {$gt : Date.now()}
    });

    if(!user){
      return errorResponse(res ,400, 'كود التحقق غير صحيح أو منتهي الصلاحية');
    };

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save();
    return successResponse(res , 200 ,'تم إعادة تعيين كلمة المرور بنجاح' );
 
  } catch (error) {
    errorResponse(res , 500 , error.message);
  };
};

// Logout 
/**
 *
 * @desc Logout
 * @route DELETE /api/auth/logout
 */


exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((user) => user.token !== req.token);

    await req.user.save();
    successResponse(res, 200 ,"تم تسجيل الخروج بنجاح");
  } catch (error) {
    errorResponse(res , 500, error.message);
  };
};

// Contact Us
/**
 *
 * @desc Contact Us
 * @route POST /api/contact
 */
exports.contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    //  send message to campany email
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `رسالة جديدة من ${name}`,
      html: `
        <h2>رسالة جديدة من موقع داوايا</h2>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>الإيميل:</strong> ${email}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${message}</p>
      `
    });

    //  send message to confirm user
    await sendEmail({
      to: email,
      subject: 'شكراً لتواصلك مع داوايا',
      html: `
        <h2>مرحباً ${name}</h2>
        <p>وصلتنا رسالتك وهنرد عليك في أقرب وقت </p>
        <p><strong>رسالتك:</strong></p>
        <p>${message}</p>
      `
    });

    successResponse(res , 200 , 'تم إرسال رسالتك بنجاح' );

  } catch (error) {
    errorResponse(res , 500 , error.message );
  }
};

// Contact Us
/**
 *
 * @desc Submit Pharmacy Request
 * @route POST /api/auth/pharmacy-request
 */
exports.submitPharmacyRequest = async (req, res) => {
  try {
    const {
      pharmacyName,
      pharmacyPhone,
      deliveryArea,
      workingHours,
      managerName,
      managerPhone,
      managerEmail
    } = req.body;

    // save in database
     const request = await PharmacyRequest.create({
      pharmacyName,
      pharmacyPhone,
      deliveryArea,
      workingHours,
      managerName,
      managerPhone,
      managerEmail,
      documents: {
        commercialRegister: req.files?.commercialRegister?.[0]?.originalname || '',
        taxCard:             req.files?.taxCard?.[0]?.originalname || '',
        pharmacyLicense:     req.files?.pharmacyLicense?.[0]?.originalname || '',
      },
    });

    try{
    // send mail to admin 
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `طلب انضمام صيدلية — ${pharmacyName}`,
      attachments: [
        req.files?.commercialRegister && {
          filename: `سجل_تجاري.${req.files.commercialRegister[0].mimetype.split('/')[1]}`,
          content: req.files.commercialRegister[0].buffer
        },
        req.files?.taxCard && {
          filename: `بطاقة_ضريبية.${req.files.taxCard[0].mimetype.split('/')[1]}`,
          content: req.files.taxCard[0].buffer
        },
        req.files?.pharmacyLicense && {
          filename: `رخصة_صيدلية.${req.files.pharmacyLicense[0].mimetype.split('/')[1]}`,
          content: req.files.pharmacyLicense[0].buffer
        }
      ].filter(Boolean), 
      html: `
        <h2>طلب انضمام صيدلية جديدة</h2>
        <p><strong>اسم الصيدلية:</strong> ${pharmacyName}</p>
        <p><strong>تليفون الصيدلية:</strong> ${pharmacyPhone}</p>
        <p><strong>منطقة التوصيل:</strong> ${deliveryArea}</p>
        <p><strong>مواعيد العمل:</strong> ${workingHours}</p>
        <p><strong>اسم المدير:</strong> ${managerName}</p>
        <p><strong>تليفون المدير:</strong> ${managerPhone}</p>
        <p><strong>إيميل المدير:</strong> ${managerEmail}</p>
      `
    });

    await sendEmail({
      to: managerEmail,
      subject: 'شكراً لتسجيلك في داوايا ',
      html: `
        <h2>مرحباً ${managerName}!</h2>
        <p>استلمنا بيانات صيدلية <strong>${pharmacyName}</strong> بنجاح.</p>
        <p> فريقنا هيراجع البيانات وهيرد عليك في أقرب وقت.</p>
        <p>مع تحيات فريق داوايا 💚</p>
      `
    });
      } catch (emailError) {
      console.error('فشل إرسال إيميل طلب الصيدلية:', emailError.message);
    }

    successResponse(res, 200, 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريباً');

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};