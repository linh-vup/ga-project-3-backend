import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model('Category', categorySchema);
