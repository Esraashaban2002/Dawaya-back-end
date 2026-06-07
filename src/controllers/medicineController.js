const Medicine = require('../models/Medicine');
const { successResponse, errorResponse } = require('../util/response');

// GET /api/medicines — كل الأدوية مع فلتر وبحث
/**
 *
 * @desc Get All Medicines
 * @route  GET /api/medicines
 */
exports.getAllMedicines = async (req, res) => {
    try {
        const {
            name,        // بحث بالاسم
            category,    // فلتر بالتصنيف
            page = 1,    // pagination
            limit = 10
        } = req.query;

        const query = {};

        // لو في بحث بالاسم
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // i = case insensitive
        };

        // لو في فلتر بالتصنيف
        if (category) {
            query.category = category;
        };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        Medicine.find(query)
            .skip(skip)
            .limit(limitNumber)

        successResponse(res, 200, "تمت العملية بنجاح", {
            total,
            page: Number(page),
            pages: Math.ceil(total / limitNumber),
            data: medicines
        });

    } catch (error) {
        errorResponse(res, 500, error.message);
    };
};

// GET /api/medicines/:id — دواء معين
/**
 *
 * @desc Get Medicine By Id
 * @route  GET /api/medicines/:id
 */
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return errorResponse(res, 404, 'الدواء مش موجود');
        };

        successResponse(res, 200, "تمت العملية بنجاح", medicine);

    } catch (error) {
        errorResponse(res, 500, error.message);
    };
};


// ─────────────────────────────────────────
// POST /api/medicines — إضافة دواء جديد (Admin)
// ─────────────────────────────────────────
/**
 * @desc Create New Medicine
 * @route POST /api/medicines
 * @access Private (Admin only)
 */
exports.createMedicine = async (req, res) => {
    try {
        const {
            name,
            genericName,
            category,
            description,
            price,
            requiresPrescription,
            image,
            manufacturer
        } = req.body;

        // تحقق إن الدواء مش موجود بالاسم ده خلاص
        const existing = await Medicine.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existing) {
            return errorResponse(res, 400, 'دواء بالاسم ده موجود بالفعل');
        }

        const medicine = await Medicine.create({
            name,
            genericName,
            category,
            description,
            price,
            requiresPrescription,
            image,
            manufacturer
        });

        successResponse(res, 201, 'تم إضافة الدواء بنجاح', medicine);

    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

// ─────────────────────────────────────────
// PUT /api/medicines/:id — تعديل دواء (Admin)
// ─────────────────────────────────────────
/**
 * @desc Update Medicine
 * @route PUT /api/medicines/:id
 * @access Private (Admin only)
 */
exports.updateMedicine = async (req, res) => {
    try {
        const allowedUpdates = ['name', 'genericName', 'category', 'description', 'price', 'requiresPrescription', 'image', 'manufacturer'];
        const updates = Object.keys(req.body);

        const isValid = updates.every(update => allowedUpdates.includes(update));
        if (!isValid) {
            return errorResponse(res, 400, 'يوجد حقول غير مسموح بتعديلها');
        }

        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!medicine) {
            return errorResponse(res, 404, 'الدواء مش موجود');
        }

        successResponse(res, 200, 'تم تعديل الدواء بنجاح', medicine);

    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

// ─────────────────────────────────────────
// DELETE /api/medicines/:id — حذف دواء (Admin)
// ─────────────────────────────────────────
/**
 * @desc Delete Medicine
 * @route DELETE /api/medicines/:id
 * @access Private (Admin only)
 */
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine) {
            return errorResponse(res, 404, 'الدواء مش موجود');
        }

        successResponse(res, 200, 'تم حذف الدواء بنجاح');

    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};