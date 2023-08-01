import User from '../models/User'
import Sequelize = require('sequelize')

interface UpdatedScore {
    updatedScore: number
    updatedSuccessResponses: number
}

export async function updateScore(
    userId: string,
    success: boolean,
    points: number
): Promise<UpdatedScore> {
    const user = await User.findOne({ 
        where: {
            id: userId
        } 
    })

    if(!user) {
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

export async function updateActiveQuestion(
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
    } catch(err) {
        return false
    }
}