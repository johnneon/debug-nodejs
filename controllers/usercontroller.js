import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../db.js';

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
    }, 'lets_play_sum_games_man', {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).send(error.message);
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
      return res.status(403).send({
        error: "User not found."
      });
    }

    bcrypt.compare(password, user.passwordHash, function (err, matches) {
      if (!matches) {
        return res.status(502).send({
          error: "Passwords do not match."
        });
      }

      const token = jwt.sign({
        id: user.id
      }, 'lets_play_sum_games_man', {
        expiresIn: 60 * 60 * 24
      });

      return res.json({
        user,
        message: "Successfully authenticated.",
        sessionToken: token
      });
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
})

export default userController;