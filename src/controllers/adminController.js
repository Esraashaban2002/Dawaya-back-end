const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../util/response');

// ─────────────────────────────────────────
// STATS
// ─────────────────────────────────────────

exports.getStats = async (req, res) => {
  try {
    const [users, pharmacies, orders] = await Promise.all([
      User.countDocuments(),
      Pharmacy.countDocuments(),
      Order.countDocuments()
    ]);

    successResponse(res, 200, "تمت العمليه بنجاح", { users, pharmacies, orders });

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    successResponse(res, 200, "تمت العمليه بنجاح", {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return errorResponse(res, 404, 'المستخدم مش موجود');
    }

    successResponse(res, 200, "تمت العمليه بنجاح", user);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 404, 'المستخدم مش موجود');
    }

    successResponse(res, 200, 'تم تغيير الرول بنجاح', user);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'المستخدم مش موجود');
    }

    successResponse(res, 200, 'تم حذف المستخدم بنجاح');

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// ─────────────────────────────────────────
// PHARMACIES
// ─────────────────────────────────────────

exports.createPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);

    successResponse(res, 201, 'تم إضافة الصيدلية بنجاح', pharmacy);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      return errorResponse(res, 404, 'الصيدلية مش موجودة');
    }

    successResponse(res, 200, 'تم تعديل الصيدلية بنجاح', pharmacy);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.togglePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return errorResponse(res, 404, 'الصيدلية مش موجودة');
    }

    pharmacy.isOpen = !pharmacy.isOpen;
    await pharmacy.save();

    successResponse(res, 200, `الصيدلية دلوقتي ${pharmacy.isOpen ? 'مفتوحة' : 'مغلقة'}`, pharmacy);

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return errorResponse(res, 404, 'الصيدلية مش موجودة');
    }

    successResponse(res, 200, 'تم حذف الصيدلية بنجاح');

  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// ─────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'username email')
        .populate('pharmacy', 'name address')
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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
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