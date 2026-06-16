const mongoose = require('mongoose');

const pharmacyRequestSchema = new mongoose.Schema(
  {
    pharmacyName: {
      type: String,
      required: true,
      trim: true,
    },
    pharmacyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryArea: {
      type: String,
      required: true,
      trim: true,
    },
    workingHours: {
      type: String,
      required: true,
      trim: true,
    },
    managerName: {
      type: String,
      required: true,
      trim: true,
    },
    managerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    managerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ── المرفقات (بيانات الملف، مش الملف نفسه؛ الملف بيروح بالإيميل) ──
    documents: {
      commercialRegister: { type: String }, // اسم الملف فقط، أو رابط لو خزنته على cloud
      taxCard:             { type: String },
      pharmacyLicense:     { type: String },
    },

    // ── حالة الطلب ──
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // ملاحظة الأدمن لو رفض الطلب مثلاً
    adminNote: {
      type: String,
      default: '',
    },

    // الأدمن اللي راجع الطلب
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PharmacyRequest', pharmacyRequestSchema);