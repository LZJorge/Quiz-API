import Question from '../models/Question'
import sportsData from '../data/sportsData.json'
import musicData from '../data/musicData.json'
import artData from '../data/artData.json'
import historyData from '../data/historyData.json'
import programmingData from '../data/programmingData.json'
import { IQuestion } from '../definitions'
import { QuestionValidationError, validateQuestion } from '../validators/questionValidator'
import Category from '../models/Category'

async function validateData(data: IQuestion[]): Promise<void> {
    for (const questionData of data) {
        validateQuestion(questionData)
    }
}

async function loadData(data: IQuestion[]): Promise<void> {
    try {
        for (const questionData of data) {
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
        }
    } catch(error) {
        if(error instanceof QuestionValidationError) {
            throw new QuestionValidationError(error.message, error.question)
        }
    }
}

export async function loadQuestionData(): Promise<void> {
    try {
        await Promise.all([
            validateData(sportsData),
            validateData(musicData),
            validateData(historyData),
            validateData(artData),
            validateData(programmingData)
        ])
          
        console.log('All questions verified ✅')
          
        await Promise.all([
            loadData(sportsData),
            loadData(musicData),
            loadData(historyData),
            loadData(artData),
            loadData(programmingData)
        ])
        
        console.log('Questions loaded successfully ✅')
    } catch(error) {
        if(error instanceof QuestionValidationError) {
            console.log('❌', error.name, '❌')
            console.log(error.message, '\n')
            console.log(error.question)

            await Promise.all([
                Question.destroy({
                    where: {}, truncate: true
                }),

                Category.destroy({
                    where: {}, truncate: true
                })
            ])

            console.log('❗Questions not loaded, close server, fix data and try again')
        }
    }
}