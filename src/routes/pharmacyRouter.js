const express = require('express');
const router = express.Router();
const {
  getAllPharmacies,
  getPharmaciesByMedicine,
  getPharmacyStock,
  getNearbyPharmacies
} = require('../controllers/pharmacyController');

/**
 * @swagger
 * /api/pharmacies/nearby:
 *   get:
 *     summary: Get nearby pharmacies by location
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         example: 30.0444
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         example: 31.2357
 *       - in: query
 *         name: maxDistance
 *         required: false
 *         schema:
 *           type: number
 *         example: 5000
 *         description: المسافة بالمتر - default 5000
 *     responses:
 *       200:
 *         description: List of nearby pharmacies
 *       400:
 *         description: lng and lat are required
 *       500:
 *         description: Server error
 */
router.get('/nearby', getNearbyPharmacies);

/**
 * @swagger
 * /api/pharmacies:
 *   get:
 *     summary: Get all pharmacies
 *     tags: [Pharmacies]
 *     responses:
 *       200:
 *         description: List of pharmacies
 *       500:
 *         description: Server error
 */
router.get('/', getAllPharmacies);

/**
 * @swagger
 * /api/pharmacies/medicine/{medicineId}:
 *   get:
 *     summary: Get pharmacies that have a specific medicine
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: medicineId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: List of pharmacies with the medicine
 *       404:
 *         description: No pharmacies found with this medicine
 *       500:
 *         description: Server error
 */
router.get('/medicine/:medicineId', getPharmaciesByMedicine);

/**
 * @swagger
 * /api/pharmacies/{id}/stock:
 *   get:
 *     summary: Get stock of a specific pharmacy
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Pharmacy stock details
 *       404:
 *         description: Pharmacy not found
 *       500:
 *         description: Server error
 */
router.get('/:id/stock', getPharmacyStock);

module.exports = router;