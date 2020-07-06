const config = require("./config.js");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: config.db,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: config.dialect,
  query: {
    raw: true,
  },
});

module.exports = sequelize;
