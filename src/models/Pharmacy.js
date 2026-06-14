const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الصيدلية مطلوب'],
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  image: { type: String },
  rating: { type: Number, default: 0 },
  distance: { type: String },
  estimatedTime: { type: String },
  mapLink: { type: String },
  services: [{ type: String }],
  isOpen: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // pharmacist
  }
}, { timestamps: true });


module.exports = mongoose.model('Pharmacy', pharmacySchema);