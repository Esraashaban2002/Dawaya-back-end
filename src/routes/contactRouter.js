const express = require('express');
const router = express.Router();
const { contactUs } = require('../controllers/authController');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Mohamed
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               message:
 *                 type: string
 *                 example: عندي سؤال عن توفر دواء معين
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
router.post('/', contactUs);

module.exports = router;