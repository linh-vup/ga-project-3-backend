import express from 'express';
import brandController from '../controllers/brandController';
import secureRoute from '../middleware/secureRoute';

const Router = express.Router();

Router.route('/products');

Router.route('/brands')
  .get(brandController.getAllBrands)
  .post(secureRoute, brandController.createNewBrand);

Router.route('/login');

export default Router;
