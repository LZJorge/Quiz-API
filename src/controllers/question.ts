/**
 * Questions Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
import { NextFunction, Response } from 'express'
import { IUserRequest } from '../definitions'
import { updateScore, updateActiveQuestion } from '../services/userServices'
import { getRandomQuestion, getQuestionById } from '../services/questionServices'

class QuestionController {

    /**
     * Get Random Question
     * @url '/question'
     * @method GET
     */
    public static async getRandomQuestion(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {

        /**
         * Active question != 0 means user has active question
         * So return the same question
         */
        if(req.user.activeQuestion != 0) {
            const question = await getQuestionById(req.user.activeQuestion)

            res.status(200).json(question)
        } else {
            const question = await getRandomQuestion()
    
            if(question) {
                await updateActiveQuestion(req.user.id, question.id)
    
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
     * Get Random Question by category
     * @url '/question/:category'
     * @method GET
     */
    public static async getQuestionByCategory(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        if(req.user.activeQuestion != 0) {
            const q = await getQuestionById(req.user.activeQuestion)

            if(q && q.Category?.name == req.params.category) {
                res.status(200).json(q)
                return
            }
        }
        
        const question = await getRandomQuestion(req.params.category)

        if(question) {
            await updateActiveQuestion(req.user.id, question.id)

            req.user.activeQuestion = question.id
            req.user.totalQuestions = req.user.totalQuestions + 1

            req.login(req.user, (error) => {
                if(error) {
                    next(error)
                } else {
                    res.status(200).json(question)
                }
            })
        } else {
            res.status(400).json({
                code: 'error',
                message: 'No existe esa categoría'
            })
        }
    }

    /**
     * Send Answer
     * @url '/question'
     * @method POST
     * @method PUT
     * @method PATCH
     */
    public static async sendAnswer(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        const { answer } = req.body

        if(req.user.activeQuestion == 0) {
            res.status(400).json({
                message: 'No tienes ninguna pregunta activa'
            })
            return
        }

        const question = await getQuestionById(req.user.activeQuestion)
        req.user.activeQuestion = 0

        if (question) {
            const success: boolean = answer === question.correctAnswer

            const { 
                updatedScore, 
                updatedSuccessResponses 
            } = await updateScore(req.user.id, success, question.points)

            req.user.score = updatedScore
            req.user.successResponses = updatedSuccessResponses

            req.login(req.user, (error) => {
                if (error) {
                    return next(error)
                }

                if(success) {
                    res.status(200).send({
                        code: 'success',
                        message: `¡Respuesta correcta! +${question.points} puntos`
                    })
                } else {
                    res.status(200).send({
                        code: 'fail',
                        message: 'Respuesta incorrecta. -10 puntos'
                    })
                }
            })
        } else {
            res.status(500).send({
                code: 'error',
                message: 'No se encontró la pregunta'
            })
        }
    }
}

export default QuestionController