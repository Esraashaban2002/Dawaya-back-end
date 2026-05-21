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