import jwt from 'jsonwebtoken';
import { User } from '../db.js';
import { constants } from '../common/constants.js';
import {
  FORBIDDEN,
  UNAUTHORIZED,
  BAD_REQUEST,
} from 'http-status-codes';

const {
  NO_TOKEN,
  NOT_AUTH,
  OPTIONS,
} = constants;

export const validateSession = async (req, res, next) => {
	if (req.method == OPTIONS) {
		return next();
	}

	const sessionToken = req.headers.authorization.slice(7, req.headers.authorization.length);
	
	if (!sessionToken) {
		return res.status(FORBIDDEN).send({
			auth: false,
			message: NO_TOKEN,
		});
	}

	jwt.verify(sessionToken, 'lets_play_sum_games_man', async (err, decoded) => {
		if (decoded) {
			try {
				const user = await User.findOne({
					where: {
						id: decoded.id
					}
				});
				req.user = user;
				return next();
			} catch (error) {
				return res.status(UNAUTHORIZED).send({
					error: NOT_AUTH,
				});
			}
		}

		return res.status(BAD_REQUEST).send({
			error: NOT_AUTH,
		});
	});
}