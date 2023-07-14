/**
 * Main file
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import Express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import Router from './routes/router'
import sequelize from './config/db'
import User from './models/User'
import Question from './models/Question'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from './config/passport'
import SQLiteStoreFactory from 'connect-sqlite3'

const SQLiteStore = SQLiteStoreFactory(session)

config()

class App {
	private readonly app: Express.Application
	private readonly port: number | string = process.env.PORT || 8000
	private readonly router: Router

	constructor() {
		this.app = Express()
		this.router = new Router()

		this.setMiddlewares()
		this.setRoutes()
	}

	private setMiddlewares(): void {
		const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' })

		this.app.use(morgan('common', { stream: accessLogStream }))
		this.app.use(Express.urlencoded({
			extended: true
		}))
		this.app.use(Express.json())
		this.app.use(cookieParser())

		this.app.use(Express.static(path.join(__dirname, '../public')))

		this.app.use( (req, res, next) => {
			res.header("Access-Control-Allow-Origin", "http://localhost:5173")
			res.header(
				"Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept"
			)
			res.header("Access-Control-Allow-Credentials", "true")
			next()
		})

		this.app.use(session({
			secret: 'keyboard cat',
			resave: true,
			saveUninitialized: true,
			store: new SQLiteStore({ db: './db.sqlite3' }) as any,
			cookie: {
				sameSite: false,
				httpOnly: true,
				secure: false,
				maxAge: 1000 * 60 * 60 * 24,
			}
		}))

		this.app.use(cors({
			origin: 'http://localhost:5173',
			methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
			credentials: true
		}))
		
		this.app.use(passport.initialize())
		this.app.use(passport.session())
	}

	private async setDatabases(): Promise<void> {
		await sequelize.sync()
		await User.sync()
		await Question.sync()
	}

	private setRoutes(): void {
		this.app.use('/', this.router.getRoutes())
	}

	public async startServer(): Promise<void> {
		await this.setDatabases()
		await this.app.listen(this.port)

		console.log(`\n🚀 Server running on http://localhost:${this.port} in ${process.env.NODE_ENV} mode 🚀`)
		console.log(`📅 Started at ${new Date()}`)
		console.log(`\n🛑 Press CTRL-C to stop\n`)
	}
}

export default App
