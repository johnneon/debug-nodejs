import { Sequelize } from 'sequelize';
import { config } from './common/config.js';

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = config;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
});

sequelize.authenticate().then(
    () => console.log("Connected to DB"),
    (err) => console.log(`Error: ${err}`),
);

export const db = sequelize;