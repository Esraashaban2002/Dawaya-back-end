const express = require('express');
const router = express.Router();
const { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const { auth, isAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines with search and filter
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: search
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

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Add a new medicine
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - genericName
 *               - mainCategory
 *               - subCategory
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "بروفين 400 مجم"
 *               genericName:
 *                 type: string
 *                 example: "Ibuprofen"
 *               mainCategory:
 *                 type: string
 *                 example: "الأدوية"
 *               subCategory:
 *                 type: string
 *                 example: "مسكنات"
 *               description:
 *                 type: string
 *                 example: "مسكن للألم ومضاد للالتهابات"
 *               price:
 *                 type: number
 *                 example: 25
 *               quantity:
 *                 type: number
 *                 example: 150
 *               requiresPrescription:
 *                 type: boolean
 *                 example: false
 *               images:
 *                 type: string
 *                 example: ["https://example.com/image.jpg"]
 *               manufacturer:
 *                 type: string
 *                 example: "شركة فاركو"
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Medicine already exists or invalid category
 *       500:
 *         description: Internal server error
 */
router.post('/', createMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Update medicine
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Medicine ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "بروفين 600 مجم"
 *               genericName:
 *                 type: string
 *                 example: "Ibuprofen"
 *               category:
 *                 type: string
 *                 example: "مسكنات"
 *               description:
 *                 type: string
 *                 example: "مسكن للألم ومضاد للالتهابات"
 *               price:
 *                 type: number
 *                 example: 30
 *               requiresPrescription:
 *                 type: boolean
 *                 example: false
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               manufacturer:
 *                 type: string
 *                 example: "شركة فاركو"
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       400:
 *         description: Invalid update fields
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Delete medicine
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Medicine ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteMedicine);

module.exports = router;