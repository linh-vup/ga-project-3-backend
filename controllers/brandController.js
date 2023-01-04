import Brand from '../models/brand.js';
import Product from '../models/product.js';

async function createNewBrand(req, res, next) {
  try {
    const newBrand = await Brand.create(req.body);

    await Product.updateMany(
      { _id: newBrand.products },
      { $push: { brand: newBrand._id } }
    );

    return res.status(201).json(newBrand);
  } catch (e) {
    next(e);
  }
}

async function getAllBrands(_req, res, next) {
  try {
    const brands = await Brand.find();
    return res.status(200).json(brands);
  } catch (e) {
    next(e);
  }
}

async function getAllProductsForBrand(req, res, next) {
  try {
    const brand = await Brand.findById(req.params.id).populate('products');
    return res.status(200).json(brand);
  } catch (e) {
    next(e);
  }
}

async function deleteBrand(req, res, next) {
  try {
    await Brand.findByIdAndDelete(req.params.id);

    const products = await Product.updateMany(
      { brand: req.params.id },
      { $unset: { brand: 1 } }
    );
    console.log({ products });

    return res.status(200).send({ message: 'Successfully delete Brand' });
  } catch (error) {
    next(error);
  }

  return res.status(301).send({ message: 'Error deleting brand' });
}

console.log('Brand.js is here');

export default {
  createNewBrand,
  getAllBrands,
  getAllProductsForBrand,
  deleteBrand
};
