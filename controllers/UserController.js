import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config/enviroment.js';

async function registerUser(req, res, next) {
  try {
    if (req.body.password !== req.body.passwordConfirmation) {
      return res.status(422).json({ message: 'Passwords must be the same!' });
    }

    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

async function loginUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    const isValidPassword = user.validatePassword(req.body.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: '6h' }
    );

    return res.status(200).send({ token, message: `Logged In as ${user._id}` });
  } catch (e) {
    next(e);
  }
}

const singleUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate('reviews');
    console.log(user);
    return res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};

export default { registerUser, loginUser, singleUserProfile };
