const Order = require("../models/Order");
//const Referral = require("../models/Referral");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  // Inside your placeOrder function
const { referralCode } = req.body; 

if (referralCode) {
  const session = await Referral.findOne({ referralCode, expiresAt: { $gt: new Date() } });
  
  if (session && !session.buyers.includes(req.user._id)) {
    session.buyers.push(req.user._id);
    
    if (session.buyers.length >= 3) {
      session.isCompleted = true;
    }
    await session.save();
  }
}

  try {
    const { items, shippingInfo, paymentMethod, total, referralCode } = req.body;


    const order = await Order.create({
  user: req.user._id,

  items: items.map(item => ({
    productId: item._id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity
  })),
  totalAmount: total,
  shippingInfo,
  paymentMethod,
  status: "Placed"
});

    // Handle referral logic if referral code is provided
    // if (referralCode) {
    //   const referral = await Referral.findOne({ referralCode });

    //   if (referral && referral.expiresAt > new Date()) {
    //     // Check if user already purchased through this referral
    //     const existingPurchase = referral.purchases.find(p =>
    //       p.user.toString() === req.user._id.toString()
    //     );

    //     if (!existingPurchase) {
    //       // Add purchase to referral
    //       referral.purchases.push({
    //         user: req.user._id,
    //         purchasedAt: new Date()
    //       });

    //       await referral.save();

    //       // Check if reward conditions are met (3 purchases within 24 hours)
    //       if (referral.purchases.length >= 3) {
    //         // Apply reward to referrer
    //         const referrer = await User.findById(referral.referrer);

    //         if (!referrer.rewards) {
    //           referrer.rewards = [];
    //         }

    //         referrer.rewards.push({
    //           type: "referral_discount",
    //           amount: 100, // ₹100 discount
    //           description: `Referral reward for ${referral.purchases.length} successful referrals`,
    //           date: new Date()
    //         });

    //         await referrer.save();
    //       }
    //     }
    //   }
    // }

        // 3. CLEAR THE CART for this specific user
    await Cart.findOneAndDelete({ user: req.user._id });

    res.json({
      success: true,
      orderId: order._id,
      message: "Order placed successfully!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};