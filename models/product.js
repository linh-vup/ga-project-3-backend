import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true, max: 300 },
  reviewer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, min: 1, max: 300 },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  brand: { type: mongoose.Schema.ObjectId, ref: 'Brand' },
  reviews: [reviewSchema]
});

productSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('Product', productSchema);

// to discuss:
// type: new schema "ProductCategory?"
