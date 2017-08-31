import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import config from '../../config';

const router = express.Router();

router.post('/', (req, res) => {
  const { identifier, password } = req.body;

  User.query({
    where: { username: identifier },
    orWhere: { email: identifier },
  })
    .fetch()
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(password, user.get('password_digest'))) {
          const userData = {
            id: user.get('id'),
            username: user.get('username'),
          };

          const { secret, expiresIn } = config.auth.jwt;
          jwt.sign(
            userData,
            secret,
            {
              expiresIn,
            },
            (err, token) => {
              if (!err) {
                res.cookie('id_token', token, {
                  maxAge: 1000 * expiresIn,
                  httpOnly: true,
                });
                res.redirect('/');
              } else {
                res
                  .status(401)
                  .json({ errors: { form: 'Invalid Credentials' } });
              }
            },
          );
        } else {
          res.status(401).json({ errors: { form: 'Invalid Credentials' } });
        }
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } });
      }
    });
});

export default router;
