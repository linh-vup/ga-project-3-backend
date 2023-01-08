import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import mongooseHidden from 'mongoose-hidden';
import { emailRegex } from '../lib/StringTesters.js';
import { reviewSchema } from './reviews.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => emailRegex.test(email)
  },
  password: {
    type: String,
    required: true,
    validate: (password) =>
      /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
  },
  reviews: [reviewSchema],
  cloudinaryImageId: { type: String }
});

userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(
  mongooseHidden({ defaultHidden: { password: true, email: true } })
);
userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('User', userSchema);
