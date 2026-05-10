const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");
const { register, verifyEmail, login, forgetpass, reastpass } = require("../controllers/authController");
const router = express.Router();
const auth = authMiddleware.auth;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
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
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - email
  *               - otp
  *             properties:
  *               email:
  *                 type: string
  *               otp:
  *                 type: string
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successfully
 */

router.post("/login",login);


/**
 * @swagger
 * /api/auth/forgetpassword:
 *   post:
 *     summary: Forget Password
 *     tags: [Auth]
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
 *     responses:
 *       200:
 *         description: Reast OTP code sent to your email
 */

router.post("/forgetpassword",forgetpass);

/**
 * @swagger
 * /api/auth/reastpassword:
 *   put:
 *     summary: Reast Password
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reast successfully!
 */

router.put("/reastpassword",reastpass);


// router.delete("/logout", auth, async (req, res) => {
//   try {
//     req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);

//     await req.user.save();
//     res.send({ message: "Logged out from this session." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

// router.delete("/logoutAll", auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send({ message: "Logged out from all sessions." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

module.exports = router;