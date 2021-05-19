import jwt from 'jsonwebtoken';
import {
	User
} from '../db.js';

export const validateSession = async (req, res, next) => {
	if (req.method == 'OPTIONS') {
		return next();
	}

	const sessionToken = req.headers.authorization.slice(7, req.headers.authorization.length);
	
	if (!sessionToken) {
		return res.status(403).send({
			auth: false,
			message: "No token provided."
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
				return res.status(401).send({
					error: "not authorized"
				});
			}
		}

		return res.status(400).send({
			error: "not authorized"
		});
	});
}