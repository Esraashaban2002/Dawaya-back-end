const express = require('express');
const router = express.Router();
const { getAllMedicines, getMedicineById } = require('../controllers/medicineController');
const { auth, isAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines with search and filter
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by medicine name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of medicines
 */
router.get('/', getAllMedicines);

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine details
 *       404:
 *         description: Medicine not found
 */
router.get('/:id', getMedicineById);

module.exports = router;