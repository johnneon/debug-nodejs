import sequelizePkg from 'sequelize';
import {
	config
} from './common/config.js';
import { Game as GameModel } from './models/game.js';
import { User as UserModel } from './models/user.js';

const { Sequelize, DataTypes } = sequelizePkg;

const {
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
} = config;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
	port: DB_PORT,
  dialect: 'postgres'
});

export const User = UserModel(sequelize, DataTypes);
export const Game = GameModel(sequelize, DataTypes);

User.sync({ force: true });
Game.sync({ force: true });

export const db = sequelize;