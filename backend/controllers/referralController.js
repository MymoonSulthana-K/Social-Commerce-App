const Referral = require('../models/Referral');

exports.startReferral = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existingReferral = await Referral.findOne({
      referrerId: req.user._id,
      productId,
      expiresAt: { $gt: new Date() },
      discountApplied: false,
    });

    if (existingReferral) {
      return res.status(200).json(existingReferral);
    }

    const referralCode = Math.random().toString(36).substring(2, 8);

    const newReferral = new Referral({
      referrerId: req.user._id,
      productId,
      referralCode,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newReferral.save();
    res.status(201).json(newReferral);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to start referral" });
  }
};

exports.checkReferralStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const referral = await Referral.findOne({ 
      referrerId: req.user._id, 
      productId, 
      expiresAt: { $gt: new Date() },
      discountApplied: false,
    });
    res.json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch referral status" });
  }
};
