import SQLiteStoreFactory from 'connect-sqlite3'
import session from 'express-session'

const SQLiteStore = SQLiteStoreFactory(session)

const sessionConfig = {
    secret: process.env.SECRET_KEY || 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new SQLiteStore({ db: './db.sqlite3' }) as any,
    cookie: {
        sameSite: false,
        httpOnly: process.env.NODE_ENV === 'production' ? false : true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}

export default sessionConfig