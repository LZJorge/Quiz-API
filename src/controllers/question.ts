/**
 * Questions Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
import { Response } from 'express'
import { IUserRequest } from '../definitions'
import UserService from '../services/userService'
import QuestionService from '../services/questionService'
import { QUESTION_CODE, RESPONSE_CODE } from '../definitions'
import { normalizeString } from '../helpers/normalizeHelper'
import userService from '../services/userService'

class QuestionController {

    /**
     * Get Random Question
     * @url '/question'
     * @method GET
     */
    public static async getRandomQuestion(req: IUserRequest, res: Response): Promise<void> {
        const user = await userService.getUser(req.user.id)

        if (!user) {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'Error al obtener el usuario',
            })
            return
        }
        
        /**
         * Active question != 0 means user has active question
         * So return the same question
         */
        if(user.activeQuestion != 0) {
            const question = await QuestionService.getQuestionById(user.activeQuestion)

            res.status(200).json(question)
        } else {
            const question = await QuestionService.getRandomQuestion()
    
            if(question) {
                await UserService.updateActiveQuestion(user, question.id)
                await UserService.updateTotalQuestions(user)

                res.status(200).json(question)
            }
        }
    }

    /**
     * Get Random Question by category
     * @url '/question/:category'
     * @method GET
     */
    public static async getQuestionByCategory(req: IUserRequest, res: Response): Promise<void> {
        const user = await userService.getUser(req.user.id)

        if(!user) {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'Error al obtener el usuario'
            })
            return
        }
        
        /**
         * If active questions has same category of category params returns same question
         */
        if(user.activeQuestion != 0) {
            const question = await QuestionService.getQuestionById(user.activeQuestion)
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

        await UserService.updateActiveQuestion(user, question.id)
        await UserService.updateTotalQuestions(user)
        
        res.status(200).json(question)
    }

    /**
     * Send Answer
     * @url '/question'
     * @method POST
     * @method PUT
     * @method PATCH
     */
    public static async sendAnswer(req: IUserRequest, res: Response): Promise<void> {
        const { answer } = req.body
        const user = await userService.getUser(req.user.id)

        if (!user) {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'Error al obtener el usuario',
            })
            return
        }

        if(user.activeQuestion == 0) {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'No tienes ninguna pregunta activa'
            })
            return
        }

        const question = await QuestionService.getQuestionById(user.activeQuestion)
        if (!question) {
            res.status(500).send({
                code: RESPONSE_CODE.ERROR,
                message: 'No se encontró la pregunta'
            })
            return
        }

        await UserService.updateActiveQuestion(user, 0)
        const success: boolean = answer === question.correctAnswer

        await UserService.updateScore(user.id, success, question.points)

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
    }
}

export default QuestionController