import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { SECRET } from '../config/enviroment.js';

const secureRoute = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer')) {
      return res.status(301).json({ message: 'unauthorised' });
    }

    const token = authToken.substring(7);

    jwt.verify(token, SECRET, async (err, data) => {
      if (err) {
        return res.status(301).json({ message: 'unauthorised' });
      }

      const user = await User.findById(data.userId);

      if (!user) {
        return res.status(301).json({ message: 'unauthorised' });
      }

      req.currentUser = user;

      next();
    });
  } catch (e) {
    return res.status(301).json({ message: 'unauthorised' });
  }
};

export default secureRoute;
