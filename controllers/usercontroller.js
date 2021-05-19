import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../db.js';
import { constants } from '../common/constants.js';
import { config } from '../common/config.js';
import {
  CREATED,
  OK,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  BAD_GATEWAY,
} from 'http-status-codes';

const { JWT_SECRET } = config;

const {
  USER_NOT_FOUND,
  PASSWORDS_DO_NOT_MATCH,
  SUCCESSFULY_AUTH,
} = constants;

const userController = Router();

userController.post('/signup', async (req, res) => {
  try {
    const {
      full_name,
      username,
      password,
      email
    } = req.body.user;
    
    const user = await User.create({
      full_name: full_name,
      username: username,
      passwordHash: bcrypt.hashSync(password, 10),
      email: email,
    });

    const token = jwt.sign({
      id: user.id,
    }, JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(CREATED).json({ user, token });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error.message);
  }
})

userController.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body.user;
    const user = await User.findOne({
      where: {
        username: username
      }
    });

    if (!user) {
      return res.status(FORBIDDEN).send({
        error: USER_NOT_FOUND,
      });
    }

    bcrypt.compare(password, user.passwordHash, function (err, matches) {
      if (!matches) {
        return res.status(BAD_GATEWAY).send({
          error: PASSWORDS_DO_NOT_MATCH
        });
      }

      const token = jwt.sign({
        id: user.id
      }, JWT_SECRET, {
        expiresIn: 60 * 60 * 24
      });

      return res.status(OK).json({
        user,
        message: SUCCESSFULY_AUTH,
        sessionToken: token
      });
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error.message);
  }
})

export default userController;