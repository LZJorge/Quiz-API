/**
 * Database connection
 * SQLite
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Sequelize } from 'sequelize'
import SQLite from 'sqlite3'

const { NODE_ENV } = process.env
const storage = NODE_ENV === 'test' ? ':memory:' : 'db.sqlite3'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage,
    logging: false,
    dialectOptions: {
        mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE,
    },
})

export default sequelize