const Order = require("../models/Order");
const Referral = require("../models/Referral");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, paymentMethod, total, referralCode, discountedItems } = req.body;

    console.log("Order being created with referralCode:", referralCode);
    console.log("User ID:", req.user._id);

    // Handle referral logic if referral code is provided
    if (referralCode) {
      const referral = await Referral.findOne({ 
        referralCode, 
        expiresAt: { $gt: new Date() } 
      });
      
      console.log("Referral found:", referral);
      
      if (referral) {
        // Convert both to strings for proper comparison
        const userIdString = req.user._id.toString();
        const buyerIds = referral.buyers.map(id => id.toString());
        
        console.log("Checking if user already in buyers:", buyerIds, userIdString);
        
        // Check if user hasn't already purchased through this referral
        if (!buyerIds.includes(userIdString)) {
          referral.buyers.push(req.user._id);
          
          console.log("Adding buyer to referral. New buyers count:", referral.buyers.length);
          
          // Check if referral is now completed (3 or more unique buyers)
          if (referral.buyers.length >= 3) {
            referral.isCompleted = true;
            console.log("Referral completed!");
          }
          
          await referral.save();
          console.log("Referral saved successfully");
        } else {
          console.log("User already purchased using this referral");
        }
      } else {
        console.log("Referral code expired, invalid, or not found:", referralCode);
      }
    } else {
      console.log("No referral code provided");
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        productId: item._id || item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      totalAmount: total,
      shippingInfo,
      paymentMethod,
      status: "Placed",
      referralCode: referralCode || null
    });

    // Clear the cart for this user
    await Cart.findOneAndDelete({ user: req.user._id });

    // Reset referrals for discounted items (referrer used their discount)
    if (discountedItems && discountedItems.length > 0) {
      for (const productId of discountedItems) {
        await Referral.findOneAndUpdate({
          referrerId: req.user._id,
          productId,
          isCompleted: true
        }, {
          discountApplied: true
        });
        console.log(`Referral marked as discounted for product ${productId} after referrer used discount`);
      }
    }

    res.json({
      success: true,
      orderId: order._id,
      message: "Order placed successfully!"
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
}  

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
