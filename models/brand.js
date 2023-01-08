import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model('Brand', brandSchema);
