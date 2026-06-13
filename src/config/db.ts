/**
 * Database connection
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()

if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Missing required database environment variables (DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST)')
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

export default sequelize

