const express = require("express");
const passport = require('passport');
const authMiddleware = require("../middlewares/auth");
const { 
  register, 
  verifyEmail, 
  login, 
  forgetpassword, 
  resetPassword, 
  logout,
  submitPharmacyRequest
} = require("../controllers/authController");
const { googleAuth, googleCallback, googleFailure } = require("../controllers/googleAuthController");
const upload = require('../config/multer');
const router = express.Router();
const auth = authMiddleware.auth;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - phone
 *               - gender
 *             properties:
 *               username:
 *                 type: string
 *                 example: Jonh
 *               email:
 *                 type: string
 *                 example: jonh@example.com
 *               password:
 *                 type: string
 *                 example: Jonh@wsi2349
 *               phone:
 *                 type: string
 *                 example: 01002345630
 *               gender:
 *                 type: string
 *                 example: male
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", register);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

router.post("/verify", verifyEmail);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jonh@example.com
 *               password:
 *                 type: string
 *                 example: Jonh@wsi2349
 *     responses:
 *       200:
 *         description: User login successfully
 */

router.post("/login", login);


/**
 * @swagger
 * /api/auth/forgetpassword:
 *   post:
 *     summary: Forget Password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jonh@example.com
 *     responses:
 *       200:
 *         description: Reast OTP code sent to your email
 */

router.post("/forgetpassword", forgetpassword);

/**
 * @swagger
 * /api/auth/reastpassword:
 *   put:
 *     summary: Reast Password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: jonh@example.com
 *               password:
 *                 type: string
 *                 example: Jonh@wsi2349
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Password reast successfully!
 */

router.put("/reastpassword", resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: logout form the section
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reast successfully!
 */

router.delete("/logout",auth, logout)



/**
 * @swagger
 * /api/auth/pharmacy-request:
 *   post:
 *     summary: Submit a pharmacy registration request
 *     tags: [Pharmacy Request]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pharmacyName
 *               - pharmacyPhone
 *               - deliveryArea
 *               - workingHours
 *               - managerName
 *               - managerPhone
 *               - managerEmail
 *             properties:
 *               pharmacyName:
 *                 type: string
 *                 example: صيدلية النور
 *               pharmacyPhone:
 *                 type: string
 *                 example: "01012345678"
 *               deliveryArea:
 *                 type: string
 *                 example: المعادي، القاهرة
 *               workingHours:
 *                 type: string
 *                 example: 9 صباحاً — 11 مساءً
 *               managerName:
 *                 type: string
 *                 example: Ahmed Mohamed
 *               managerPhone:
 *                 type: string
 *                 example: "01098765432"
 *               managerEmail:
 *                 type: string
 *                 example: ahmed@example.com
 *               commercialRegister:
 *                 type: string
 *                 format: binary
 *                 description: صورة سجل تجاري
 *               taxCard:
 *                 type: string
 *                 format: binary
 *                 description: صورة بطاقة ضريبية
 *               pharmacyLicense:
 *                 type: string
 *                 format: binary
 *                 description: صورة رخصة الصيدلية
 *     responses:
 *       200:
 *         description: تم إرسال الطلب بنجاح
 *       500:
 *         description: Server error
 */
router.post('/pharmacy-request',
  upload.fields([
    { name: 'commercialRegister', maxCount: 1 },
    { name: 'taxCard', maxCount: 1 },
    { name: 'pharmacyLicense', maxCount: 1 }
  ]),
  submitPharmacyRequest
);

// router.delete("/logoutAll", auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send({ message: "Logged out from all sessions." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get('/google', googleAuth);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to frontend with token
 */
// الـ Callback
router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false
    }, (err, user, info) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${err.message}`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(info?.message || 'فشل تسجيل الدخول')}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback 
);

// لما بيفشل
router.get('/google/failure', googleFailure);

module.exports = router;