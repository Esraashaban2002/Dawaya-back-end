const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Stock = require('../models/Stock');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../util/response');

// ─────────────────────────────────────────
// STATS
// ─────────────────────────────────────────

exports.getStats = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const [totalOrders, pendingOrders, totalStock, lowStock] = await Promise.all([
      Order.countDocuments({ pharmacy: pharmacy._id }),
      Order.countDocuments({ pharmacy: pharmacy._id, status: 'pending' }),
      Stock.countDocuments({ pharmacy: pharmacy._id }),
      Stock.countDocuments({ pharmacy: pharmacy._id, quantity: { $lte: 10 } })
    ]);

    successResponse(res, 200, "تمت العمليه بنجاح", {
      totalOrders,
      pendingOrders,
      totalStock,
      lowStock
    });

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// PROFILE
exports.getProfile = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    successResponse(res, 200, "تمت العمليه بنجاح", pharmacy);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'address', 'phone', 'isOpen'];
    const updates = Object.keys(req.body);

    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) {
      return errorResponse(res, 400, 'يوجد حقول غير مسموح بتعديلها');
    }

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    successResponse(res, 200, 'تم تعديل بيانات الصيدلية بنجاح', pharmacy);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// STOCK
exports.getStock = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const stock = await Stock.find({ pharmacy: pharmacy._id })
      .populate('medicine', 'name genericName category image');

    successResponse(res, 200, "تمت العمليه بنجاح", {
      total: stock.length,
      data: stock
    });

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.addStock = async (req, res) => {
  try {
    const { medicineId, quantity, price } = req.body;

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return errorResponse(res, 404, 'الدواء مش موجود');
    }

    const existingStock = await Stock.findOne({
      pharmacy: pharmacy._id,
      medicine: medicineId
    });

    if (existingStock) {
      return errorResponse(res, 400, 'الدواء ده موجود في المخزون خلاص — استخدم تعديل المخزون');
    }

    const stock = await Stock.create({
      pharmacy: pharmacy._id,
      medicine: medicineId,
      quantity,
      price
    });

    await stock.populate('medicine', 'name genericName category');

    successResponse(res, 201, 'تم إضافة الدواء للمخزون بنجاح', stock);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity, price } = req.body;

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const stock = await Stock.findOneAndUpdate(
      { _id: req.params.id, pharmacy: pharmacy._id }, 
      { quantity, price },
      { new: true, runValidators: true }
    ).populate('medicine', 'name genericName category');

    if (!stock) {
      return errorResponse(res, 404, 'المخزون مش موجود');
    }

    successResponse(res, 200, 'تم تعديل المخزون بنجاح', stock);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const stock = await Stock.findOneAndDelete({
      _id: req.params.id,
      pharmacy: pharmacy._id 
    });

    if (!stock) {
      return errorResponse(res, 404, 'المخزون مش موجود');
    }

    successResponse(res, 200, 'تم حذف الدواء من المخزون بنجاح');

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// ORDERS
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const query = { pharmacy: pharmacy._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'username email phone')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    successResponse(res, 200, "تمت العمليه بنجاح", {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return errorResponse(res, 404, 'مش عندك صيدلية مسجلة');
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, pharmacy: pharmacy._id },
      { status },
      { new: true }
    );

    if (!order) {
      return errorResponse(res, 404, 'الطلب مش موجود');
    }

    successResponse(res, 200, 'تم تحديث حالة الطلب', order);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};