const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {

  const { product } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: []
    });
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId === product.productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push(product);
  }

  await cart.save();

  res.json(cart);
};

exports.getCart = async (req, res) => {

  const cart = await Cart.findOne({ user: req.user._id });

  res.json(cart || { items: [] });

};

exports.removeItem = async (req, res) => {

  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter(
    item => item.productId !== productId
  );

  await cart.save();

  res.json(cart);
};