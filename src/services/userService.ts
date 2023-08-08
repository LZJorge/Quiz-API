/**
 * User services
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { 
    IUser, 
    UpdatedScore, 
    LEADERBOARD_SIZE, 
    LEADERBOARD_USER_ATTRIBUTES 
} from '../definitions'
import User from '../models/User'
import Sequelize from 'sequelize'

class UserService {

    /**
     * @description
     * 
     * Inserts user into database
     */
    public async createUser(username: string, password: string): Promise<boolean> {
        try {
            const user = User.build({
                username,
                password
            })
    
            await user.save()
    
            return true
        } catch(error) {
            return false
        }
    }

    /**
     * @description
     * 
     * Gets user by his username
     * This is used to log in users
     */
    public async getUserByUsername(username: string): Promise<User | undefined> {
        try {
            const user = await User.findOne({
                where: { 
                    username: username 
                }
            })
            
            if(!user) {
                throw new Error('Usuario no encontrado')
            }
    
            return user
        } catch(error) {
            return undefined
        }
    }

    /**
     * @description
     * 
     * Updates user password
     */
    public async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
        const user = await User.findByPk(id)

        if (!user) {
            throw new Error('Ha ocurrido un error al actualizar la contraseña')
        }

        await user.update({
            password: newPassword,
        })

        return true
    }

    /**
     * @description
     * 
     * Updates user avatar
     */
    public async updateUserAvatar(id: string, newAvatar: string): Promise<boolean> {
        const user = await User.findByPk(id)

        if (!user) {
            throw new Error('Ha ocurrido un error al actualizar el avatar')
        }

        await user.update({
            avatar: newAvatar
        })

        return true
    }

    /**
     * @description
     * 
     * Get users leaderboard sorted by highest score
     */
    public async getLeaderboard(): Promise<IUser[] | undefined> {
        try {
            const leaderboard = await User.findAll({
                order: [['score', 'DESC']],
                limit: LEADERBOARD_SIZE,
                attributes: LEADERBOARD_USER_ATTRIBUTES
            })
    
            if(!leaderboard) {
                throw new Error('No se puedo obtener la tabla')
            }

            return leaderboard
        } catch(error) {
            return undefined
        }
    }

    /**
     * @description
     * 
     * Updates user score
     * Used when question is answered
     */
    public async updateScore(
        userId: string,
        success: boolean,
        points: number
    ): Promise<UpdatedScore> {
        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        const updatedScore = success ? user.score + points : Math.max(user.score - 10, 0)

        const updatedSuccessResponses = success ? user.successResponses + 1 : user.successResponses

        await User.update({
            successResponses: updatedSuccessResponses,
            activeQuestion: 0,
            score: updatedScore,
        }, {
            where: {
                id: userId
            }
        })

        return {
            updatedScore,
            updatedSuccessResponses
        }
    }

    /**
     * @description
     * 
     * Updates active question
     * Used when user gets new question
     * It prevents some minor abuses
     */
    public async updateActiveQuestion(
        userId: string,
        questionId: number
    ): Promise<boolean> {
        try {
            await User.update({
                totalQuestions: Sequelize.literal('totalQuestions + 1'),
                activeQuestion: questionId
            }, {
                where: {
                    id: userId
                }
            })

            return true
        } catch (err) {
            return false
        }
    }

    /**
     * @description
     * 
     * Deletes user from database
     */
    public async deleteUser(userID: string): Promise<boolean> {
        try {
            const deletedUsers = await User.destroy({
                where: {
                    id: userID
                }
            })

            if(deletedUsers === 0) {
                throw new Error('No se pudo eliminar al usuario')
            }

            return true
        } catch(err) {
            return false
        }
    }
}

export default new UserService()