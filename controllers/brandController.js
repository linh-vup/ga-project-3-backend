import Brand from '../models/brand.js';
import products from '../models/Product.js';

async function createnewBrand(req, res, net) {
  try {
    const newBrand = await Brand.create(req.body);

    await products.updatemany({ _id: newBrand.products }, { $push: {} });
  } catch (e) {
    next(e);
  }
}

console.log('Brand.js is here');
