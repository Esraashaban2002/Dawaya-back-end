const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");

const router = express.Router();
const auth = authMiddleware.auth;

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Jonh
 *               phone:
 *                 type: string
 *                 example: 01002345678
 *               age:
 *                 type: number
 *                 example: 20
 *               gender:
 *                 type: string
 *                 example: male
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/user/changepassword:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPass@123
 *               newPassword:
 *                 type: string
 *                 example: NewPass@456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Wrong current password
 */
router.patch("/change-password", auth, changePassword);

module.exports = router;