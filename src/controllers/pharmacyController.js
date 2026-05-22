const Pharmacy = require('../models/Pharmacy');
const Stock = require('../models/Stock');
const { successResponse, errorResponse } = require('../util/response');

// Get Nearby Pharmacies
/**
 *
 * @desc Get Nearby Pharmacies
 * @route  GET /api/pharmacies/nearby?lng=31.2357&lat=30.0444&maxDistance=5000
 */
exports.getNearbyPharmacies = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    if (!lng || !lat) {
      return errorResponse(res , 400 , 'لازم ترسل lng و lat');
    }

    const pharmacies = await Pharmacy.find({
      isOpen: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    successResponse(res , 200 , "تم تحديد اقرب صيدليه بنجاح !" , {total: pharmacies.length,
      data: pharmacies});

  } catch (error) {
    errorResponse(res , 500 ,error.message );
  };
};

// Get All Pharmacies
/**
 *
 * @desc Get All Pharmacies
 * @route  GET /api/pharmacies
 */
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isOpen: true });

    successResponse(res , 200 , "تمت العملية بنجاح" , {total: pharmacies.length,
      data: pharmacies});
  } catch (error) {
    errorResponse(res, 500 ,error.message );
  };
};

// Get Pharmacies By Medicine
/**
 *
 * @desc Get Pharmacies By Medicine
 * @route  GET /api/pharmacies/medicine/:medicineId
 */
exports.getPharmaciesByMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const stocks = await Stock.find({
      medicine: medicineId,
      quantity: { $gt: 0 } 
    }).populate('pharmacy');

    if (!stocks.length) {
      return errorResponse(res , 404 , 'مفيش صيدليات عندها الدواء ده دلوقتي');
    }

    const result = stocks.map(stock => ({
      pharmacy: {
        _id: stock.pharmacy._id,
        name: stock.pharmacy.name,
        address: stock.pharmacy.address,
        phone: stock.pharmacy.phone,
        isOpen: stock.pharmacy.isOpen
      },
      price: stock.price,
      quantity: stock.quantity
    }));

    successResponse(res , 200 , "تمت العمليه بنجاح" , {total: result.length,
      data: result});

  } catch (error) {
    errorResponse(res , 500 ,error.message );
  };
};

// Get Pharmacy Stock
/**
 *
 * @desc Get Pharmacy Stock
 * @route  GET /api/pharmacies/:id/stock
 */
exports.getPharmacyStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await Stock.find({ pharmacy: id })
      .populate('medicine', 'name genericName category price image');

    if (!stock.length) {
      return errorResponse(res , 404 , 'الصيدلية دي مش موجودة أو مفيش مخزون' );
    };

    successResponse(res , 200 , "تمت العمليه بنجاح" , {total: stock.length,
      data: stock});

  } catch (error) {
    errorResponse(res , 500 , error.message);
  };
};