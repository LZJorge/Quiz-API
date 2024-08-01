/**
 * Database connection
 * SQLite
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Sequelize } from 'sequelize'
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: "postgres",
  host: process.env.DB_HOST,
  logging: false
});

export default sequelize