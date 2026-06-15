const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;
const isPharmacist = authMiddleware.isPharmacist;

const {
  getStats,
  getProfile, updateProfile,
  getStock, addStock, updateStock, deleteStock,
  getOrders, updateOrderStatus
} = require('../controllers/pharmacyDashController');

// STATS

/**
 * @swagger
 * /api/pharmacy/stats:
 *   get:
 *     summary: Get pharmacy dashboard statistics
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get('/stats', auth, isPharmacist, getStats);

// PROFILE

/**
 * @swagger
 * /api/pharmacy/profile:
 *   get:
 *     summary: Get pharmacy profile
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       404:
 *         description: Pharmacy not found
 */
router.get('/profile', auth, isPharmacist, getProfile);

/**
 * @swagger
 * /api/pharmacy/profile:
 *   put:
 *     summary: Update pharmacy profile
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: صيدلية النور
 *               address:
 *                 type: string
 *                 example: شارع التحرير، القاهرة
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               isOpen:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid fields
 */
router.put('/profile', auth, isPharmacist, updateProfile);

// STOCK

/**
 * @swagger
 * /api/pharmacy/stock:
 *   get:
 *     summary: Get pharmacy stock
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock fetched successfully
 *       404:
 *         description: Pharmacy not found
 */
router.get('/stock', auth, isPharmacist, getStock);

/**
 * @swagger
 * /api/pharmacy/stock:
 *   post:
 *     summary: Add medicine to stock
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicineId
 *               - quantity
 *               - price
 *             properties:
 *               medicineId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               quantity:
 *                 type: number
 *                 example: 100
 *               price:
 *                 type: number
 *                 example: 15.50
 *     responses:
 *       201:
 *         description: Medicine added to stock successfully
 *       400:
 *         description: Medicine already exists in stock
 *       404:
 *         description: Medicine not found
 */
router.post('/stock', auth, isPharmacist, addStock);

/**
 * @swagger
 * /api/pharmacy/stock/{id}:
 *   put:
 *     summary: Update stock quantity and price
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 50
 *               price:
 *                 type: number
 *                 example: 18.00
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       404:
 *         description: Stock not found
 */
router.put('/stock/:id', auth, isPharmacist, updateStock);

/**
 * @swagger
 * /api/pharmacy/stock/{id}:
 *   delete:
 *     summary: Remove medicine from stock
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Medicine removed from stock successfully
 *       404:
 *         description: Stock not found
 */
router.delete('/stock/:id', auth, isPharmacist, deleteStock);

// ORDERS

/**
 * @swagger
 * /api/pharmacy/orders:
 *   get:
 *     summary: Get pharmacy orders
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, delivered, cancelled]
 *         example: pending
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       404:
 *         description: Pharmacy not found
 */
router.get('/orders', auth, isPharmacist, getOrders);

/**
 * @swagger
 * /api/pharmacy/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Pharmacy Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, delivered, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 */
router.patch('/orders/:id/status', auth, isPharmacist, updateOrderStatus);

module.exports = router;