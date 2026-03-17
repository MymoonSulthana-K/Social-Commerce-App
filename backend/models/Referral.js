const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  referralCode: { type: String, unique: true, required: true },
  expiresAt: { type: Date, required: true }, // Set to Date.now() + 24h
  buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track unique buyers
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Referral', referralSchema);