const Sequelize = require('sequelize');
const { DB_NAME, DB_USERNAME, DB_PASSWORD } = require('./common/config');

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
})

sequelize.authenticate().then(
    () => console.log("Connected to DB"),
    (err) => console.log(`Error: ${err}`),
);

module.exports = sequelize;