const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: String,
      required: true,
    },
    pImages: {
      type: Array,
      required: true,
    },
    sName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    institution: {
      type: String,
      required: true,
    },
    institutionCity: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    sId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
