const mongoose = require('mongoose');
const categoryTree = require('../constants/categories');

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
  mainCategory: {
    type: String,
    required: true,
    enum: Object.keys(categoryTree)
  },
  subCategory: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return categoryTree[this.mainCategory]?.includes(value);
      },
      message: props => `subCategory "${props.value}" غير متوافق مع الفئة الرئيسية المختارة`
    }
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