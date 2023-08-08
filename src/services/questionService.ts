import Question from '../models/Question'
import Category from '../models/Category'
import Sequelize from 'sequelize'
import { IQuestionWithCategory } from '../definitions'
import { normalizeString } from '../helpers/normalizeHelper'
import { QUESTION_ATTRIBUTES, CATEGORY_ATTRIBUTES } from '../definitions'

class QuestionService {

    /**
     * @description
     * 
     * By defaults return a random question
     * Can provide a category to return random question filtered by some category
     */
    public async getRandomQuestion(category?: string): Promise<Question | null> {
        if(category) {
            category = normalizeString(category)

            const categoryId = await Category.findOne({
                where: {
                    slug: category
                }
            })
        
            if(!categoryId) {
                return null
            }

            const question = await Question.findOne({
                where: {
                    categoryId: categoryId.id
                },
                order: Sequelize.literal('RANDOM()'),
                attributes: QUESTION_ATTRIBUTES,
                include:  [
                    {
                        model: Category,
                        attributes: CATEGORY_ATTRIBUTES
                    }
                ]
            })

            if(!question) {
                return null
            }

            return question
        }
        
        const question = await Question.findOne({
            order: Sequelize.literal('RANDOM()'),
            attributes: QUESTION_ATTRIBUTES,
            include:  [
                {
                    model: Category,
                    attributes: CATEGORY_ATTRIBUTES
                }
            ]
        })

        if(!question) {
            return null
        }
    
        return question
    }
    
    /**
     * @description
     * 
     * Returns a question by his id
     */
    public async getQuestionById(questionId: number): Promise<IQuestionWithCategory | null> {
        const question = await Question.findOne({
            where: {
                id: questionId
            },
            attributes: QUESTION_ATTRIBUTES,
            include:  [
                {
                    model: Category,
                    attributes: CATEGORY_ATTRIBUTES
                }
            ]
        })

        if(!question) {
            return null
        }
            
        return question
    }
}

export default new QuestionService()