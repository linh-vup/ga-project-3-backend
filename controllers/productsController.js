import Product from '../models/product.js';
import Brand from '../models/brand.js';
import Category from '../models/category.js';

const getAllProducts = async (_req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('brand');

    // const category = await Category.findById(req.params.id).populate(
    //   'products'
    // );

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

async function searchProducts(req, res, next) {
  console.log('QUERY', req.query);
  try {
    // search multiple keys:
    const { search } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ]
    });

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

const createNewProduct = async (req, res, next) => {
  console.log('CURRENT USER', req.currentUser);
  try {
    const product = await Product.create({
      ...req.body,
      addedBy: req.currentUser._id
    });

    await Brand.findOneAndUpdate(
      { _id: product.brand },
      { $push: { products: product._id } }
    );

    console.log('NEW PRODUCT', product._id);

    await Category.findOneAndUpdate(
      { _id: product.category },
      { $push: { products: product._id } }
    );

    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      // .populate('brand')
      .populate('reviews.reviewer');
    return product
      ? res.status(200).json(product)
      : res
          .status(404)
          .json({ message: `no product with id ${req.params.id}` });
  } catch (err) {
    next(err);
  }
};

const updateSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (
      req.currentUser._id.equals(product.addedBy) ||
      req.currentUser.isAdmin
    ) {
      product.set(req.body);
      const updatedProduct = await product.save();

      return res.status(200).json(updatedProduct);
    }
    return res.status(301).json({ message: 'Unauthorised' });
  } catch (err) {
    next(err);
  }
};

const deleteSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    console.log(product.addedBy, req.currentUser._id);

    if (
      req.currentUser._id.equals(product.addedBy) ||
      req.currentUser.isAdmin
    ) {
      await Product.findByIdAndDelete(req.params.id);

      const category = await Category.updateMany(
        { product: { _id: req.params.id } },
        { $unset: { product: 1 } }
      );

      console.log({ category });

      return res.status(200).json({ message: 'Successfully deleted product' });
    }

    return res.status(301).json({ message: 'Unauthorised' });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllProducts,
  createNewProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  searchProducts
};
