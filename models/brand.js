import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

console.log('Brand.js');
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }]
});

brandSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('Brand', brandSchema);
