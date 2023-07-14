/**
 * Express Router
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Router as ExpressRouter } from 'express'
import UserController from '../controllers/user'
import QuestionController from '../controllers/question'
import AuthController from '../controllers/auth'
import { validateCreateUser, validateDeleteUser } from '../validators/userValidator'

class Router {
	private readonly router: ExpressRouter

	constructor () {
		this.router = ExpressRouter()

		this.setUserRoutes()
		this.setQuestionRoutes()
	}

	private setUserRoutes (): void {
		this.router.post('/auth/login', AuthController.authenticateUser)	

		this.router.post('/user/create', 
			validateCreateUser,
			UserController.createUser
		)

		this.router.delete('/user/delete', 			
			AuthController.isAuthenticated,
			validateDeleteUser,
			UserController.deleteUser
		)

		this.router.get('/user/getCurrentUser',
			AuthController.isAuthenticated,
			UserController.getCurrentUser
		)

		this.router.get('/user/getLeaderboard',
			AuthController.isAuthenticated,	
			UserController.getLeaderboard
		)

		this.router.get('/user/logout', 
			AuthController.isAuthenticated,
			AuthController.logout
		)
	}

	private setQuestionRoutes (): void {
		this.router.get('/question', 
			AuthController.isAuthenticated,
			QuestionController.getQuestion
		)
		
		this.router.route('/question')
			.patch(AuthController.isAuthenticated, QuestionController.sendAnswer)
			.post(AuthController.isAuthenticated, QuestionController.sendAnswer)
			.put(AuthController.isAuthenticated, QuestionController.sendAnswer)
	}

	public getRoutes (): ExpressRouter {
		return this.router
	}
}

export default Router
