import express from 'express';
import brandController from '../controllers/brandController.js';
import secureRoute from '../middleware/secureRoute.js';
import productsController from '../controllers/productsController.js';
import UserController from '../controllers/UserController.js';
import reviewsController from '../controllers/reviewsController.js';

const Router = express.Router();

Router.route('/products')
  .get(productsController.getAllProducts)
  .post(secureRoute, productsController.createNewProduct);

Router.route('/products/:id')
  .get(productsController.getSingleProduct)
  .put(secureRoute, productsController.updateSingleProduct)
  .delete(secureRoute, productsController.deleteSingleProduct);

Router.route('/products/:id/reviews').post(
  secureRoute,
  reviewsController.createReview
);

Router.route('/products/:id/reviews/:reviewId')
  .put(secureRoute, reviewsController.updateReview)
  .delete(secureRoute, reviewsController.deleteReview);

Router.route('/brands')
  .get(brandController.getAllBrands)
  .post(secureRoute, brandController.createNewBrand);

Router.route('/profile/:userId').get(UserController.singleUserProfile);

Router.route('/register').post(UserController.registerUser);

Router.route('/login').post(UserController.loginUser);

export default Router;
