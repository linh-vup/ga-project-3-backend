import express from 'express';
import productsController from '../controllers/productsController.js';
import UserController from '../controllers/UserController.js';

const Router = express.Router();

Router.route('/products')
  .get(productsController.getAllProducts)
  .post(productsController.createNewProduct);

Router.route('/products/:id')
  .get(productsController.getSingleProduct)
  .put(productsController.updateSingleProduct)
  .delete(productsController.deleteSingleProduct);

Router.route('/brands');

Router.route('/profile/:userId').get(UserController.singleUserProfile);

Router.route('/register').post(UserController.registerUser);

Router.route('/login').post(UserController.loginUser);

export default Router;
