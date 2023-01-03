import express from 'express';
import productsController from '../controllers/productsController.js';

const Router = express.Router();

Router.route('/products')
  .get(productsController.getAllProducts)
  .post(productsController.createNewProduct);

Router.route('/products/:id')
  .get(productsController.getSingleProduct)
  .put(productsController.updateSingleProduct)
  .delete(productsController.deleteSingleProduct);

Router.route('/brands');

Router.route('/login');

export default Router;
