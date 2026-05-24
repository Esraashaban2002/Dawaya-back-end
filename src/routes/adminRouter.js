const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;
const isAdmin = authMiddleware.isAdmin;

const {
  getStats,
  getAllUsers, getUserById, updateUserRole, deleteUser,
  createPharmacy, updatePharmacy, togglePharmacy, deletePharmacy,
  getAllOrders, updateOrderStatus
} = require('../controllers/adminController');

// ─────────────────────────────────────────
// STATS
// ─────────────────────────────────────────

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get('/stats', auth, isAdmin, getStats);

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [user, admin, pharmacist]
 *         example: user
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
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/users', auth, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/users/:id', auth, isAdmin, getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Admin]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, pharmacist]
 *                 example: pharmacist
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/users/:id/role', auth, isAdmin, updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', auth, isAdmin, deleteUser);


// ─────────────────────────────────────────
// PHARMACIES
// ─────────────────────────────────────────

/**
 * @swagger
 * /api/admin/pharmacies:
 *   post:
 *     summary: Create new pharmacy
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - location
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
 *               location:
 *                 type: object
 *                 example: { "type": "Point", "coordinates": [31.2357, 30.0444] }
 *     responses:
 *       201:
 *         description: Pharmacy created successfully
 *       500:
 *         description: Server error
 */
router.post('/pharmacies', auth, isAdmin, createPharmacy);

/**
 * @swagger
 * /api/admin/pharmacies/{id}:
 *   put:
 *     summary: Update pharmacy
 *     tags: [Admin]
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
 *               name:
 *                 type: string
 *                 example: صيدلية النور
 *               address:
 *                 type: string
 *                 example: شارع التحرير، القاهرة
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *     responses:
 *       200:
 *         description: Pharmacy updated successfully
 *       404:
 *         description: Pharmacy not found
 */
router.put('/pharmacies/:id', auth, isAdmin, updatePharmacy);

/**
 * @swagger
 * /api/admin/pharmacies/{id}/toggle:
 *   patch:
 *     summary: Toggle pharmacy open/close
 *     tags: [Admin]
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
 *         description: Pharmacy status toggled
 *       404:
 *         description: Pharmacy not found
 */
router.patch('/pharmacies/:id/toggle', auth, isAdmin, togglePharmacy);

/**
 * @swagger
 * /api/admin/pharmacies/{id}:
 *   delete:
 *     summary: Delete pharmacy
 *     tags: [Admin]
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
 *         description: Pharmacy deleted successfully
 *       404:
 *         description: Pharmacy not found
 */
router.delete('/pharmacies/:id', auth, isAdmin, deletePharmacy);

// ─────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
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
 *         description: List of all orders
 *       403:
 *         description: Forbidden
 */
router.get('/orders', auth, isAdmin, getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Admin]
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
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.patch('/orders/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;