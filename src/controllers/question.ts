/**
 * Questions Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { NextFunction, Response } from 'express'
import Sequelize from 'sequelize'
import Question from '../models/Question'
import User from '../models/User'
import { IUserRequest } from '../definitions'

class QuestionController {

    /**
     * Get Question
     * GET @url '/question'
     */
    public static async getQuestion(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        const questionsCount = await Question.count()
        const questionAttributes = [
            'id', 
            'question', 
            'correctAnswer', 
            'options', 
            'points', 
            'difficulty'
        ]

        if(req.user.activeQuestion != 0) {
            const question = await Question.findOne({
                where: {
                    id: req.user.activeQuestion
                },
                attributes: questionAttributes
            })

            res.status(200).json(question)
        } else {
            const randomID = Math.floor(Math.random() * (questionsCount) + 1)

            const question = await Question.findOne({
                where: {
                    id: randomID
                },
                attributes: questionAttributes
            })
    
            if(question) {
                await User.update({
                    totalQuestions: Sequelize.literal(`totalQuestions + 1`),
                    activeQuestion: question.id
                }, {
                    where: {
                        id: req.user.id
                    }
                })
    
                req.user.activeQuestion = question.id
                req.user.totalQuestions = req.user.totalQuestions + 1
    
                req.login(req.user, (error) => {
                    if(error) {
                        next(error)
                    } else {
                        res.status(200).json(question)
                    }
                })
            }
        }

        
    }

    /**
     * Send Answer
     * POST, PUT, PATCH @url '/question'
     */
    public static async sendAnswer(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        const { answer } = req.body
        const questionID = req.user.activeQuestion

        if(questionID == 0) {
            res.status(400).json({
                message: 'No tienes ninguna pregunta activa'
            })
            return
        }

        const question = await Question.findOne({
            where: {
                id: questionID
            },
            attributes: [
                'id',
                'correctAnswer',
                'points'
            ]
        })

        req.user.activeQuestion = 0

        if (question) {
            if (answer === question.correctAnswer) {
                await User.update({
                    successResponses: Sequelize.literal(`successResponses + 1`),
                    activeQuestion: 0,
                    score: Sequelize.literal(`score + ${question.points}`)
                }, {
                    where: {
                        id: req.user.id
                    }
                })

                req.user.score += question.points
                req.user.successResponses = req.user.successResponses + 1

                req.login(req.user, (error) => {
                    if (error) {
                        return next(error)
                    }

                    res.status(200).send({
                        code: 'success',
                        message: `¡Respuesta correcta! +${question.points} puntos`
                    })
                })
            } else {
                await User.update({
                    activeQuestion: 0,
                    score: Sequelize.literal(
                        `CASE 
                            WHEN score >= 10 THEN score - 10
                            WHEN score = 5 THEN score - 5
                            ELSE score 
                        END`
                    )
                }, {
                    where: {
                        id: req.user.id
                    }
                })

                req.user.score = Math.max(req.user.score - 10, 0)

                req.login(req.user, (error) => {
                    if (error) {
                        return next(error)
                    }

                    res.status(200).send({
                        code: 'fail',
                        message: 'Respuesta incorrecta. -10 puntos'
                    })
                })
            }
        } else {
            res.status(500).send({
                code: 'error',
                message: 'No se encontró la pregunta'
            })
        }
    }
}

export default QuestionController