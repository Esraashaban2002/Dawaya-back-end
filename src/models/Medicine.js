const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الدواء مطلوب'],
    trim: true,
    index: true  //  بيسرّع الـ search
  },
  genericName: {
    type: String,
    trim: true   // الاسم العلمي — مثلاً Paracetamol
  },
  category: {
    type: String,
    required: true,
    enum: ['مسكنات', 'مضادات حيوية', 'أدوية مزمنة', 'فيتامينات', 'أخرى']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],  // array of URLs
    default: []
  },
  manufacturer: {
    type: String   // الشركة المصنعة
  }
}, { timestamps: true });

//  Text index للبحث بالاسم
medicineSchema.index({ name: 'text', genericName: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);