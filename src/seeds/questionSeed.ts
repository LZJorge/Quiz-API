import Question from '../models/Question'
import questions from './questions.json'
import { validateQuestion } from '../validators/questionValidator'

export async function loadData(): Promise<void> {
    for (const questionData of questions) {
        const errors: string[] = validateQuestion(questionData) 

        if(errors.length > 0) {
            console.log('Los datos de entrada no son válidos:', errors)
            continue
        } else {
            const { question, correctAnswer, options, points, difficulty } = questionData

            const questionRecord = Question.build({
                question,
                correctAnswer,
                options,
                points,
                difficulty
            })

            await questionRecord.save()
        }
    }
}