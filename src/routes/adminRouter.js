const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;
const isAdmin = authMiddleware.isAdmin;

const {
  getStats,
  getAllUsers, getUserById, updateUserRole, deleteUser,
  createPharmacy, updatePharmacy, togglePharmacy, deletePharmacy,
  getAllOrders, updateOrderStatus,
  deletePharmacyRequest,
  updatePharmacyRequestStatus,
  getPharmacyRequestById,
  getPharmacyRequests
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


// PHARMACIES

/**
 * @swagger
 * /api/admin/pharmacies:
 *   post:
 *     summary: Create new pharmacy and pharmacist account
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: صيدلية الخير
 *               email:
 *                 type: string
 *                 example: pharmacy@gmail.com
 *               password:
 *                 type: string
 *                 example: "********"
 *               address:
 *                 type: string
 *                 example: فيصل، الجيزة
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               image:
 *                 type: string
 *                 example: "https://images/pharmacies/khair.png"
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               distance:
 *                 type: string
 *                 example: "9.2 KM"
 *               estimatedTime:
 *                 type: string
 *                 example: "25 دقيقة"
 *               mapLink:
 *                 type: string
 *                 example: "https://maps.google.com/?q=30.0131,31.2024"
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Parking", "24h"]
 *     responses:
 *       201:
 *         description: Pharmacy and pharmacist account created successfully
 *       400:
 *         description: Email already exists
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


// ORDERS

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



/**
 * @swagger
 * /api/admin/pharmacy-requests:
 *   get:
 *     summary: Get all pharmacy join requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         example: pending
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: List of pharmacy requests
 *       403:
 *         description: Forbidden
 */
router.get('/pharmacy-requests', auth, isAdmin, getPharmacyRequests);
 
/**
 * @swagger
 * /api/admin/pharmacy-requests/{id}:
 *   get:
 *     summary: Get single pharmacy request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Pharmacy request details
 *       404:
 *         description: Request not found
 */
router.get('/pharmacy-requests/:id', auth, isAdmin, getPharmacyRequestById);
 
/**
 * @swagger
 * /api/admin/pharmacy-requests/{id}/status:
 *   patch:
 *     summary: Approve or reject a pharmacy request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *                 enum: [approved, rejected, pending]
 *                 example: approved
 *               adminNote:
 *                 type: string
 *                 example: "تمت الموافقة بعد مراجعة المستندات"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Request not found
 */
router.patch('/pharmacy-requests/:id/status', auth, isAdmin, updatePharmacyRequestStatus);
 
/**
 * @swagger
 * /api/admin/pharmacy-requests/{id}:
 *   delete:
 *     summary: Delete pharmacy request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Pharmacy request deleted successfully
 *       404:
 *         description: Request not found
 */
router.delete('/pharmacy-requests/:id', auth, isAdmin, deletePharmacyRequest);

module.exports = router;