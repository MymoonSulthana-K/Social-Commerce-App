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

// Check if current user was referred and eligible for 10% discount on their next purchase
exports.checkReferredUserDiscount = async (req, res) => {
  try {
    // Find all completed referrals where current user is a buyer but hasn't claimed their discount yet
    const referralWithDiscount = await Referral.findOne({
      buyers: req.user._id,
      isCompleted: true,
      discountClaimedBy: { $ne: req.user._id } // User hasn't claimed their discount yet
    });

    if (referralWithDiscount) {
      return res.json({
        eligible: true,
        referralCode: referralWithDiscount.referralCode,
        productId: referralWithDiscount.productId,
        discount: 10, // 10% discount for referred users
        message: "You are eligible for a 10% discount on your next purchase as a referred customer!"
      });
    }

    res.json({
      eligible: false,
      discount: 0,
      message: "You are not eligible for a referred user discount"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to check referred user discount" });
  }
};
