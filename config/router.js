import express from 'express';
import UserController from '../controllers/UserController.js';

const Router = express.Router();

Router.route('/products');

Router.route('/brands');

Router.route('/profile/:userId').get(UserController.singleUserProfile);

Router.route('/register').post(UserController.registerUser);

Router.route('/login').post(UserController.loginUser);

export default Router;
