/**
 * Questions Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
import { NextFunction, Response } from 'express'
import { IUserRequest } from '../definitions'
import UserService from '../services/userService'
import QuestionService from '../services/questionService'
import { QUESTION_CODE, RESPONSE_CODE } from '../definitions'
import { normalizeString } from '../helpers/normalizeHelper'

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
            const question = await QuestionService.getQuestionById(req.user.activeQuestion)

            res.status(200).json(question)
        } else {
            const question = await QuestionService.getRandomQuestion()
    
            if(question) {
                await UserService.updateActiveQuestion(req.user.id, question.id)
    
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
        
        /**
         * If active questions has same category of category params returns same question
         */
        if(req.user.activeQuestion != 0) {
            const question = await QuestionService.getQuestionById(req.user.activeQuestion)
            const category = normalizeString(req.params.category)

            if(question && question.Category?.slug == category) {
                res.status(200).json(question)
                return
            }
        }
        
        /**
         * Continue ands return random question by the category
         */
        const question = await QuestionService.getRandomQuestion(req.params.category)
        if(!question) {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'No existe esa categoría'
            })
            return
        }

        await UserService.updateActiveQuestion(req.user.id, question.id)

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
                code: RESPONSE_CODE.ERROR,
                message: 'No tienes ninguna pregunta activa'
            })
            return
        }

        const question = await QuestionService.getQuestionById(req.user.activeQuestion)
        if (!question) {
            res.status(500).send({
                code: RESPONSE_CODE.ERROR,
                message: 'No se encontró la pregunta'
            })
            return
        }

        req.user.activeQuestion = 0
        const success: boolean = answer === question.correctAnswer

        const { 
            updatedScore, 
            updatedSuccessResponses 
        } = await UserService.updateScore(req.user.id, success, question.points)

        req.user.score = updatedScore
        req.user.successResponses = updatedSuccessResponses

        req.login(req.user, (error) => {
            if (error) {
                return next(error)
            }

            if(success) {
                res.status(200).send({
                    code: QUESTION_CODE.SUCCESS,
                    message: `¡Respuesta correcta! +${question.points} puntos 😃`
                })
            } else {
                res.status(200).send({
                    code: QUESTION_CODE.FAILED,
                    message: 'Respuesta incorrecta. -10 puntos ☹️'
                })
            }
        })
    }
}

export default QuestionController