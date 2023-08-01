import Question from '../models/Question'
import sportsData from '../data/sportsData.json'
import programmingData from '../data/programmingData.json'
import { IQuestion } from '../definitions'
import { QuestionValidationError, validateQuestion } from '../validators/questionValidator'
import Category from '../models/Category'

async function loadData(data: IQuestion[]): Promise<void> {
    for (const questionData of data) {
        try {
            validateQuestion(questionData)
            
            const { 
                question, 
                correctAnswer, 
                options, 
                points, 
                difficulty,
                category
            } = questionData

            const categoryData = await Category.findOne({
                where: {
                    name: category
                }
            })

            const questionRecord = Question.build({
                question,
                correctAnswer,
                options,
                points,
                difficulty,
                categoryId: categoryData?.id
            })

            await questionRecord.save()
        } catch(error) {
            if(error instanceof QuestionValidationError) {
                console.log(error.name)
                console.log(error.message)
            }
        }
    }
}

export async function loadQuestionData(): Promise<void> {
    await loadData(sportsData)
    await loadData(programmingData)
}