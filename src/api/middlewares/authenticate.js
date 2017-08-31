import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/user';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Failed Authentication!' });
      } else {
        User.query({
          where: { id: decoded.id },
          select: [
            'email',
            'client_id as id',
            'username',
            'id as client_user_id',
          ],
        })
          .fetch()
          .then(user => {
            if (!user) {
              res.status(404).json({ error: 'User does not Exist!' });
            } else {
              req.currentUser = user;
              next();
            }
          });
      }
    });
  } else {
    res.status(403).json({
      error: 'Not logged in',
    });
  }
};
