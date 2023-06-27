/**
 * Database connection
 * SQLite
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Sequelize } from 'sequelize'
import SQLite from 'sqlite3'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite3',
    dialectOptions: {
        mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE,
    },
})

export default sequelize