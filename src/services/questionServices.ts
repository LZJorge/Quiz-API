import Question from "../models/Question"
import Category from "../models/Category"
import Sequelize from "sequelize"
import { IQuestionWithCategory } from "../definitions"

const questionAttributes = [
    'id', 
    'question', 
    'correctAnswer', 
    'options', 
    'points', 
    'difficulty'
]

export async function getRandomQuestion(category?: string): Promise<Question | null> {
    const categoryId = category ? 
        await Category.findOne({
            where: {
                name: category
            }
        })
        :
        false
    
    if(category && !categoryId) {
        return null
    }

    const question = categoryId ?
        await Question.findOne({
            where: {
                categoryId: categoryId.id
            },
            order: Sequelize.literal('RANDOM()'),
            attributes: questionAttributes,
            include:  [
                {
                    model: Category,
                    attributes: ['name']
                }
            ]
        })
        :
        await Question.findOne({
            order: Sequelize.literal('RANDOM()'),
            attributes: questionAttributes,
            include:  [
                {
                    model: Category,
                    attributes: ['name']
                }
            ]
        })

    return question
}

export async function getQuestionById(questionId: number): Promise<IQuestionWithCategory | null> {
    const question = await Question.findOne({
        where: {
            id: questionId
        },
        attributes: questionAttributes,
        include:  [
            {
                model: Category,
                attributes: ['name']
            }
        ]
    })
        
    return question
}