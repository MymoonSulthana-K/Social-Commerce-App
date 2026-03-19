const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

//Get all products
router.get("/", async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    let filter = {};

    //If subcategory is selected → use it directly
    if (subCategory) {
      filter.category = subCategory;
    }
    //Else if only major category is selected
    else if (category) {
      if (category === "Men") {
        filter.category = {
          $in: ["Men Suits", "Men Ties", "Men Shoes", "Men Watches"],
        };
      } else if (category === "Women") {
        filter.category = {
          $in: ["Business Suits", "Women Footwear", "Formal Bags", "Office Watches"],
        };
      }
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;