const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  parentCategory: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: ""
  },
  subcategory: {
    type: String,
    default: ""
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
