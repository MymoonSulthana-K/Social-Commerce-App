const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {

  const { product } = req.body;

  if (!product || !product._id) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: []
    });
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId?.toString() === product._id.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    if (!product._id) {
      return res.status(400).json({ message: "Product ID missing" });
    }
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  await cart.save();

  res.json(cart);
};

exports.getCart = async (req, res) => {

  const cart = await Cart.findOne({ user: req.user._id });

  res.json(cart || { items: [] });

};

exports.updateQuantity = async (req, res) => {

  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);

  } else {
    res.status(404).json({ message: "Item not found in cart" });
  }

};

exports.removeItem = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
  item => item.productId.toString() === productId.toString()
);

  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ message: "Item not found in cart" });
  }
};

exports.clearCart = async (req, res) => {

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];

  await cart.save();

  res.json({ message: "Cart cleared", cart });

};