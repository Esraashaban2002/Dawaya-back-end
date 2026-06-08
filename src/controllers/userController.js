const User = require("../models/User");

// Get Profile
/**
 *
 * @desc Get Profile
 * @route  GET /api/user/profile
 */

exports.getProfile = async (req, res) => {
  try {
    successResponse(
      res,
      200,
      "تم جلب بيانات المستخدم بنجاح",
      req.user
    );
  } catch (error) {
    errorResponse(
      res,
      500,
      error.message
    );

  }
};

// Update Profile
/**
 *
 * @desc Update Profile
 * @route  PUT /api/user/profile
 */

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['username', 'phone', 'age', 'gender'];
    const updates = Object.keys(req.body);

    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) {
      return errorResponse(
        res,
        400,
        "يوجد حقول غير مسموح بتعديلها"
      );
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    successResponse(
      res,
      200,
      "تم تحديث البيانات بنجاح",
      req.user
    );

  } catch (error) {
   errorResponse(
      res,
      500,
      error.message
    );
  }
};

// Change Password
/**
 *
 * @desc Change Password
 * @route  PATCH /api/auth/changepassword
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return errorResponse(
        res,
        400,
        "كلمة المرور الحالية غير صحيحة"
      );
    }

    if (oldPassword === newPassword) {
      return errorResponse(
        res,
        400,
        "يجب أن تكون كلمة المرور الجديدة مختلفة عن القديمة"
      );
    }

    user.password = newPassword;

    user.tokens = [];

    await user.save();

    rsuccessResponse(
      res,
      200,
      "تم تغيير كلمة المرور بنجاح، يرجى تسجيل الدخول مرة أخرى"
    );

  } catch (error) {
    errorResponse(
      res,
      500,
      error.message
    );
  }
};
