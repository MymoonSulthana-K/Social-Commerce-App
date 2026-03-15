const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({

  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  productId: {
    type: Number,
    required: true
  },

  referralCode: {
    type: String,
    required: true,
    unique: true
  },

  expiresAt: {
    type: Date,
    required: true
  },

  purchases: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      purchasedAt: Date
    }
  ]

});

module.exports = mongoose.model("Referral", referralSchema);