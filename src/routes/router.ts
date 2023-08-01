/**
 * Express Router
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Router as ExpressRouter } from 'express'
import UserController from '../controllers/user'
import QuestionController from '../controllers/question'
import AuthController from '../controllers/auth'
import CategoryController from '../controllers/category'
import { 
	validateCreateUser, 
	validateUpdateUserPassword,
	validateUserAvatar,
	validateDeleteUser 
} from '../validators/userValidator'

class Router {
	private readonly router: ExpressRouter

	constructor () {
		this.router = ExpressRouter()

		this.setUserRoutes()
		this.setQuestionRoutes()
		this.setCategoriesRoutes()
	}

	private setUserRoutes (): void {
		this.router.post('/auth/login', AuthController.authenticateUser)	

		this.router.post('/user/create', 
			validateCreateUser,
			UserController.createUser
		)

		this.router.route('/user/update/password')
			.put(
				AuthController.isAuthenticated,
				validateUpdateUserPassword,
				UserController.updateUserPassword
			)
			.patch(
				AuthController.isAuthenticated,
				validateUpdateUserPassword,
				UserController.updateUserPassword
			)

		this.router.route('/user/update/avatar')
			.put(
				AuthController.isAuthenticated,
				validateUserAvatar,
				UserController.updateUserAvatar
			)
			.patch(
				AuthController.isAuthenticated,
				validateUserAvatar,
				UserController.updateUserAvatar
			)

		this.router.delete('/user/delete', 			
			AuthController.isAuthenticated,
			validateDeleteUser,
			UserController.deleteUser
		)

		this.router.get('/user/current',
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

		this.router.get('/avatars/get',
			AuthController.isAuthenticated,
			UserController.getAvatars
		)
	}

	private setQuestionRoutes (): void {		
		this.router.route('/question')
			.get(
				AuthController.isAuthenticated,
				QuestionController.getRandomQuestion
			)
			.patch(
				AuthController.isAuthenticated, 
				QuestionController.sendAnswer
			)
			.post(
				AuthController.isAuthenticated, 
				QuestionController.sendAnswer
			)
			.put(
				AuthController.isAuthenticated, 
				QuestionController.sendAnswer
			)

		this.router.get('/question/:category', 
			AuthController.isAuthenticated, 
			QuestionController.getQuestionByCategory
		)
	}

	private setCategoriesRoutes (): void {
		this.router.get('/category/get', 
			AuthController.isAuthenticated, 
			CategoryController.getCategories
		)
	}

	public getRoutes (): ExpressRouter {
		return this.router
	}
}

export default Router
