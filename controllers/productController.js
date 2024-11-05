const Product = require("../models/productModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const getAllProduct = async (req, res) => {
  const products = await Product.find().populate("reviews");
  res.status(StatusCodes.OK).json(products);
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId });
  if (!product) {
    throw new CustomError.NotFoundError("Sorry there no product");
  }
  res.status(StatusCodes.OK).json(product);
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.productId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError("there is no product to update ");
  }
  res.status(StatusCodes.OK).json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId });
  if (!product) {
    throw new CustomError.NotFoundError("Sorry there no product");
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "product has been deleted" });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded.");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image format.");
  }
  const maxSiez = 1024 * 1024;
  if (productImage.size > maxSiez) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB."
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    productImage.name
  );
  productImage.mv(imagePath);
  console.log(req.files);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};

/* const deleteProduct = async (req, res) => {
    const product = await Product.findOne({ _id: req.params.productId });
  
    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
  
    await product.remove();
    res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
  }; */
