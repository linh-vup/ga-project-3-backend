import Review from '../models/reviews.js';
import Product from '../models/product.js';
import User from '../models/user.js';

async function createReview(req, res, next) {
  try {
    const newReview = await Review.create({
      ...req.body,
      reviewer: req.currentUser._id
    });

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: newReview } }
    );

    const userWithReviews = await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { reviews: newReview } }
    );

    console.log({ userWithReviews });

    return res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
}

async function updateReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'product not found' });
    }

    const productReview = product.reviews.id(req.params.reviewId);

    if (!productReview) {
      return res.status(404).send({ message: 'Review not found' });
    }

    if (
      !review.reviewer.equals(req.currentUser._id) &&
      !req.currentUser.isAdmin
    ) {
      return res.status(301).send({
        message: "Unauthorised: you cannot update another user's review"
      });
    }

    const newReview = review.set(req.body);
    const updatedReview = productReview.set(req.body);

    await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $pull: { reviews: { _id: req.params.reviewId } } }
    );

    await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { reviews: newReview } }
    );

    const savedProd = product.save();

    return res.status(200).json(newReview);
  } catch (err) {
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }

    if (
      !review.reviewer.equals(req.currentUser._id) &&
      !req.currentUser.isAdmin
    ) {
      return res.status(301).send({
        message: "Unauthorised: you cannot update another user's review"
      });
    }

    review.remove();

    review.set(req.body);

    const savedProduct = await product.save();

    await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $pull: { reviews: { _id: req.params.reviewId } } }
    );

    return res.status(200).json(savedProduct);
  } catch (err) {
    next(err);
  }
}

export default { createReview, updateReview, deleteReview };
