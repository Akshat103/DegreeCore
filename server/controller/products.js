const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");

class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      let Products = await productModel.find({})
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, sName, institution, institutionCity, year, sId } = req.body;
    let images = req.files;
    // Validation
    if (
      !pName |
      !pDescription |
      !pPrice |
      !sName |
      !institution |
      !institutionCity |
      !year |
      !sId
    ) {
      Product.deleteImages(images, "file");
      return res.json({ error: "All filled must be required" });
    }
    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    }
    // Validate Images
    else if (images.length !== 1) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Must need to provide 1 image" });
    } else {
      try {
        let allImages = [];
        for (const img of images) {
          allImages.push(img.filename);
        }
        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice,
          sName,
          institution,
          institutionCity,
          year,
          sId
        });
        let save = await newProduct.save();
        console.log(save)
        if (save) {
          return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditProduct(req, res) {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      institution,
      institutionCity,
      year,
      pImages,
    } = req.body;
    let editImages = req.files;

    // Validate other fileds
    if (
      !pId |
      !pName |
      !pDescription |
      !pPrice |
      !institution |
      !institutionCity |
      !year
    ) {
      return res.json({ error: "All filled must be required" });
    }
    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 1000) {
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    }
    // Validate Update Images
    else if (editImages && editImages.length == 1) {
      Product.deleteImages(editImages, "file");
      return res.json({ error: "More tha 1 image is not allowed" });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice,
        institution,
        institutionCity,
        year,
      };
      if (editImages) {
        if (editImages.length == 1) {
          let allEditImages = [];
          for (const img of editImages) {
            allEditImages.push(img.filename);
          }
          editData = { ...editData, pImages: allEditImages };
          Product.deleteImages(pImages.split(","), "string");
        }
      }
      try {
        let editProduct = productModel.findByIdAndUpdate(pId, editData);
        editProduct.exec((err) => {
          if (err) console.log(err);
          return res.json({ success: "Product edit successfully" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          // Delete Image from uploads -> products folder
          Product.deleteImages(deleteProductObj.pImages, "string");
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getProductByAdmin(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ sId: uId })
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  }

  // async getProductByPrice(req, res) {
  //   let { price } = req.body;
  //   if (!price) {
  //     return res.json({ error: "All filled must be required" });
  //   } else {
  //     try {
  //       let products = await productModel
  //         .find({ pPrice: { $lt: price } })
  //         .populate("pCategory", "cName")
  //         .sort({ pPrice: -1 });
  //       if (products) {
  //         return res.json({ Products: products });
  //       }
  //     } catch (err) {
  //       return res.json({ error: "Filter product wrong" });
  //     }
  //   }
  // }

  // async getWishProduct(req, res) {
  //   let { productArray } = req.body;
  //   if (!productArray) {
  //     return res.json({ error: "All filled must be required" });
  //   } else {
  //     try {
  //       let wishProducts = await productModel.find({
  //         _id: { $in: productArray },
  //       });
  //       if (wishProducts) {
  //         return res.json({ Products: wishProducts });
  //       }
  //     } catch (err) {
  //       return res.json({ error: "Filter product wrong" });
  //     }
  //   }
  // }

  // async getCartProduct(req, res) {
  //   let { productArray } = req.body;
  //   if (!productArray) {
  //     return res.json({ error: "All filled must be required" });
  //   } else {
  //     try {
  //       let cartProducts = await productModel.find({
  //         _id: { $in: productArray },
  //       });
  //       if (cartProducts) {
  //         return res.json({ Products: cartProducts });
  //       }
  //     } catch (err) {
  //       return res.json({ error: "Cart product wrong" });
  //     }
  //   }
  // }

  // async postAddReview(req, res) {
  //   let { pId, uId, rating, review } = req.body;
  //   if (!pId || !rating || !review || !uId) {
  //     return res.json({ error: "All filled must be required" });
  //   } else {
  //     let checkReviewRatingExists = await productModel.findOne({ _id: pId });
  //     if (checkReviewRatingExists.pRatingsReviews.length > 0) {
  //       checkReviewRatingExists.pRatingsReviews.map((item) => {
  //         if (item.user === uId) {
  //           return res.json({ error: "Your already reviewd the product" });
  //         } else {
  //           try {
  //             let newRatingReview = productModel.findByIdAndUpdate(pId, {
  //               $push: {
  //                 pRatingsReviews: {
  //                   review: review,
  //                   user: uId,
  //                   rating: rating,
  //                 },
  //               },
  //             });
  //             newRatingReview.exec((err, result) => {
  //               if (err) {
  //                 console.log(err);
  //               }
  //               return res.json({ success: "Thanks for your review" });
  //             });
  //           } catch (err) {
  //             return res.json({ error: "Cart product wrong" });
  //           }
  //         }
  //       });
  //     } else {
  //       try {
  //         let newRatingReview = productModel.findByIdAndUpdate(pId, {
  //           $push: {
  //             pRatingsReviews: { review: review, user: uId, rating: rating },
  //           },
  //         });
  //         newRatingReview.exec((err, result) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //           return res.json({ success: "Thanks for your review" });
  //         });
  //       } catch (err) {
  //         return res.json({ error: "Cart product wrong" });
  //       }
  //     }
  //   }
  // }

  //   async deleteReview(req, res) {
  //     let { rId, pId } = req.body;
  //     if (!rId) {
  //       return res.json({ message: "All filled must be required" });
  //     } else {
  //       try {
  //         let reviewDelete = productModel.findByIdAndUpdate(pId, {
  //           $pull: { pRatingsReviews: { _id: rId } },
  //         });
  //         reviewDelete.exec((err, result) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //           return res.json({ success: "Your review is deleted" });
  //         });
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }
}

const productController = new Product();
module.exports = productController;
