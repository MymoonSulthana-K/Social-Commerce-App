const Category = require("../models/Category");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Referral = require("../models/Referral");
const User = require("../models/User");

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.toString().trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const buildProductPayload = (body) => ({
  name: body.name?.trim(),
  price: Number(body.price || 0),
  description: body.description?.trim() || "",
  parentCategory: body.parentCategory?.trim() || "",
  category: body.category?.trim() || body.subcategory?.trim() || "",
  subcategory: body.subcategory?.trim() || body.category?.trim() || "",
  image: body.image || "",
  tags: normalizeTags(body.tags),
});

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, recentOrders, topProducts] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find()
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(6),
        Order.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.productId",
              name: { $first: "$items.name" },
              unitsSold: { $sum: "$items.quantity" },
              revenue: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] },
              },
            },
          },
          { $sort: { unitsSold: -1, revenue: -1 } },
          { $limit: 5 },
        ]),
      ]);

    res.json({
      totals: { totalUsers, totalProducts, totalOrders },
      recentOrders,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(buildProductPayload(req.body));
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      buildProductPayload(req.body),
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [orders, referralsStarted, referralsJoined] = await Promise.all([
      Order.find({ user: user._id }).sort({ createdAt: -1 }),
      Referral.find({ referrerId: user._id }).populate("productId", "name"),
      Referral.find({ buyers: user._id }).populate("productId", "name"),
    ]);

    res.json({
      user,
      activity: {
        orders,
        referralsStarted,
        referralsJoined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after", runValidators: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("referrerId", "name email")
      .populate("buyers", "name email")
      .populate("productId", "name category")
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories = [] } = req.body;
    const category = await Category.create({
      name,
      slug: slugify(name),
      subcategories: subcategories
        .map((subcategory) => ({
          name: subcategory.name?.trim(),
          slug: slugify(subcategory.name),
        }))
        .filter((subcategory) => subcategory.name),
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories = [] } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug: slugify(name),
        subcategories: subcategories
          .map((subcategory) => ({
            name: subcategory.name?.trim(),
            slug: slugify(subcategory.name),
          }))
          .filter((subcategory) => subcategory.name),
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
