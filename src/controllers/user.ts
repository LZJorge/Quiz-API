/**
 * Users Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request, Response } from 'express'
import User from '../models/User'
import { IUserRequest } from '../definitions'
import path from 'path'
import fs from 'fs'

class UserController {

	/**
	 * Create User
	 * POST @url '/user/create'
	 */
	public static async createUser (req: Request, res: Response): Promise<void> {
		const { username, password } = req.body

		try {
			const userExists = await User.findOne({
				where: {
					username
				}
			})
	
			if(userExists) {
				throw new Error('El nombre de usuario ya se encuentra en uso')
			}

			const user = User.build({
				username,
				password
			})

			await user.save()
			res.status(200).json({
				code: 'success',
				message: 'Usuario creado satisfactoriamente'
			})
		} catch (error: any) {
			res.status(300).json({
				code: 'error',
				message: error.message
			})
		}
	}

	/**
	 * Updates User Password
	 * PUT, PATCH @url '/user/update/password'
	 */
	public static async updateUserPassword(req: IUserRequest, res: Response): Promise<void> {
		const { newPassword } = req.body
		const { id } = req.user

		try {
			const user = await User.findByPk(id)

			if(user) {
				await user.update({
					password: newPassword,
				})
			}

			res.status(200).json({
				code: 'success',
				message: 'Contraseña actualizada'
			})
		} catch(error: any) {
			res.json({
				code: 'error',
				message: error.message
			})
		}
	}

	/**
	 * Update User Avatar
	 * PUT, PATCH @url '/user/update/avatar'
	 */
	public static async updateUserAvatar(req: IUserRequest, res: Response): Promise<void> {
		const { newAvatar } = req.body
		const { id } = req.user

		try {
			const user = await User.findByPk(id)

			if(user) {
				await user.update({
					avatar: newAvatar
				})
			}

			res.status(200).json({
				code: 'success',
				message: 'Se actualizó el avatar'
			})
		} catch(error: any) {
			res.status(400).json({
				code: 'error',
				message: error.message
			})
		}
	}

	/**
	 * Delete User
	 * DELETE @url '/user/delete'
	 */
	public static async deleteUser(req: IUserRequest, res: Response): Promise<void> {
		const { userID } = req.body
		const { id } = req.user

		try {
			if (id && id === userID) {
				await User.destroy({
					where: {
						id: userID
					}
				})
		
				req.session.destroy(() => {
					res.status(200).json({
						code: 'success',
						message: 'El usuario ha sido eliminado'
					})
				})
			} else {
				res.status(403).send('No tienes permiso para eliminar este usuario')
			}
		} catch (error) {
			res.status(404).send(error)
		}
	}

	/**
	 * Get current user
	 * GET @url '/user/current'
	 */
	public static getCurrentUser(req: IUserRequest, res: Response): void {
		try {
			const user = {
				id: req.user.id,
				username: req.user.username,
				avatar: req.user.avatar,
				score: req.user.score,
				totalQuestions: req.user.totalQuestions,
				successResponses: req.user.successResponses,
				createdAt: req.user.createdAt
			}

			res.status(200).json({
				code: 'success',
				user: user
			})
		} catch(err) {
			res.status(500).json({
				code: 'error',
				message: 'Ha ocurrido un error'
			})
		}
	}

	/**
	 * Get User Leaderboard *10 highest score*
	 * GET @url '/user/getLeaderboard'
	 */
	public static async getLeaderboard (req: Request, res: Response): Promise<void> {
		try {
			const leaderboard = await User.findAll({
				order: [["score", "DESC"]],
				limit: 10,
				attributes: [
					'username',
					'avatar',
					'score',
					'successResponses',
					'createdAt'
				]
			})

			res.status(200).json(leaderboard)
		} catch(error: any) {
			res.json({
				code: 'error',
				message: error.message
			})
		}
	}

	/**
	 * Get User Avatars
	 */
	public static getAvatars (req: Request, res: Response): void {
		const avatarsDir = path.join(__dirname, '../../public', 'avatars');

		fs.readdir(avatarsDir, (err, files) => {
			if (err) {
				res.status(500).send('Error al leer la carpeta de avatares');
			} else {
			const avatars = files.map((file) => `/avatars/${file}`);
				res.json(avatars);
			}
		})
	}
}

export default UserController
