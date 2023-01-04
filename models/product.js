import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, min: 1, max: 300 },
  // category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  image: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  brand: { type: mongoose.Schema.ObjectId, ref: 'Brand' },
  reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }]
});

productSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('Product', productSchema);

// to discuss:
// type: new schema "ProductCategory?"
