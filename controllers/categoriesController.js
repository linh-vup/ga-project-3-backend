import Category from '../models/category.js';
import Product from '../models/product.js';

async function createNewCategory(req, res, next) {
  try {
    if (req.currentUser.isAdmin) {
      const newCategory = await Category.create(req.body);

      await Product.updateMany(
        { _id: newCategory.products },
        { $push: { category: newCategory._id } }
      );

      return res.status(201).json(newCategory);
    }
    return res.status(301).json({ message: 'Unauthorised' });
  } catch (err) {
    next(err);
  }
}

async function getAllCategories(_req, res, next) {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

async function getAllProductsForCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id).populate(
      'products'
    );
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  if (req.currentUser.isAdmin) {
    console.log(req.currentUser);
    try {
      await Category.findByIdAndDelete(req.params.id);

      const products = await Product.updateMany(
        { brewery: req.params.id },
        { $unset: { category: 1 } }
        // or
        // { $unset: { brewery: '' } }
      );
      console.log({ products });

      return res.status(200).send({ message: 'Successfully deleted category' });
    } catch (error) {
      next(error);
    }
    return;
  }

  return res.status(301).send({ message: 'Unauthorized' });
}

export default {
  createNewCategory,
  getAllProductsForCategory,
  deleteCategory,
  getAllCategories
};
