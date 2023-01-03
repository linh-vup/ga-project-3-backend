import express from 'express';

const Router = express.Router();

Router.route('/products');

Router.route('/brands');

Router.route('/login');

export default Router;
