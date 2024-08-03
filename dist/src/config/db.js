"use strict";
/**
 * Database connection
 * SQLite
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: "postgres",
    host: process.env.DB_HOST,
    logging: false
});
exports.default = sequelize;
