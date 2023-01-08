import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { reviewSchema } from './reviews.js';
import { categorySchema } from './category.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, min: 1, max: 300 },
  // category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  // category: categorySchema,
  // category: { categorySchema },
  image: { type: String, required: true },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  brand: { type: mongoose.Schema.ObjectId, ref: 'Brand' },
  reviews: [reviewSchema]
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

productSchema.virtual('rating').get(function () {
  return (
    this.reviews.reduce((acc, review) => acc + review.rating, 0) /
    this.reviews.length
  );
});

productSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('Product', productSchema);

// to discuss:
// type: new schema "ProductCategory?"
