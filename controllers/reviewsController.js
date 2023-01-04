import Review from '../models/reviews.js';
import Product from '../models/product.js';
import User from '../models/user.js';

async function createReview(req, res, next) {
  try {
    const newReview = await Review.create({
      ...req.body,
      reviewer: req.currentUser._id
    });

    console.log('NEW REVIEW', newReview);

    await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: newReview._id } }
    );
    const product = await Product.findById(req.params.id);

    console.log('PRODUCT', product);

    // const rating =
    //   product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    //   product.reviews.length;

    await User.findOneAndUpdate(
      { _id: newReview.reviewer },
      { $push: { reviews: newReview._id } }
    );

    return res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
}

async function updateReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }

    if (!review.reviewer.equals(req.currentUser._id)) {
      return res.status(301).send({
        message: "Unauthorised: you cannot update another user's review"
      });
    }

    review.set(req.body);

    await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { reviews: product.reviews } }
    );

    const rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    product.set({ rating });

    const savedProduct = await product.save();

    return res.status(200).json(savedProduct);
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

    const rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    if (rating) {
      product.set({ rating });
    } else {
      product.rating = undefined;
    }

    const savedProduct = await product.save();

    return res.status(200).json(savedProduct);
  } catch (err) {
    next(err);
  }
}

export default { createReview, updateReview, deleteReview };
