/**
 * Database connection
 * SQLite
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Sequelize } from 'sequelize'
import SQLite from 'sqlite3'
import { DB_STORAGE } from '../definitions'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_STORAGE,
    logging: false,
    dialectOptions: {
        mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE,
    },
})

export default sequelize