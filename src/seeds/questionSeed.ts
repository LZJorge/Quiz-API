import Question from '../models/Question'
import questions from './questions.json'
import { QuestionValidationError, validateQuestion } from '../validators/questionValidator'

export async function loadData(): Promise<void> {
    for (const questionData of questions) {
        try {
            validateQuestion(questionData)
            
            const { question, correctAnswer, options, points, difficulty } = questionData

            const questionRecord = Question.build({
                question,
                correctAnswer,
                options,
                points,
                difficulty
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