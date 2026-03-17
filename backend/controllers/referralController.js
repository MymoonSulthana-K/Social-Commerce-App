const Referral = require('../models/Referral');

exports.startReferral = async (req, res) => {
  const { productId } = req.body;
  const referralCode = Math.random().toString(36).substring(2, 8);
  
  const newReferral = new Referral({
    referrerId: req.user._id, // From your auth middleware
    productId,
    referralCode,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  });

  await newReferral.save();
  res.status(201).json(newReferral);
};

exports.checkReferralStatus = async (req, res) => {
  const { productId } = req.params;
  const referral = await Referral.findOne({ 
    referrerId: req.user._id, 
    productId, 
    expiresAt: { $gt: new Date() } 
  });
  res.json(referral);
};