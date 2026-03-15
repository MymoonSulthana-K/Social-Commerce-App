const Referral = require("../models/Referral");
const { v4: uuidv4 } = require("uuid");

exports.createReferral = async (req, res) => {

  const { productId } = req.body;

  const referralCode = uuidv4();

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const referral = await Referral.create({
    referrer: req.user._id,
    productId,
    referralCode,
    expiresAt
  });

  const link = `http://localhost:3000/product/${productId}?ref=${referralCode}`;

  res.json({
    referralLink: link,
    expiresAt
  });

};