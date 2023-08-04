/**
 * Question Validator
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { IQuestion } from '../definitions'
import { categories } from '../seeds/categorySeed'

export class QuestionValidationError extends Error {
    question: IQuestion

    constructor(message: string, question: IQuestion) {
        super(message)
        this.name = 'Question Validation Error'
        this.question = question
    }
}

export const validateQuestion = (questionData: IQuestion) => {

    const validateQuestionText = (questionText: string) => {
        if (!questionText || questionText.trim() === '') {
            throw new QuestionValidationError('La pregunta es requerida', questionData)
        }
    }

    const validateCorrectAnswer = (correctAnswer: string) => {
        if (!correctAnswer || correctAnswer.trim() === '') {
            throw new QuestionValidationError('La respuesta correcta es requerida', questionData)
        }
    }

    const validateOptions = (options: string[]) => {
        if (!Array.isArray(options) || options.length !== 4) {
            throw new QuestionValidationError('Las opciones deben ser un array de 4 cadenas', questionData)
        }
    }

    const validateDifficulty = (difficulty: string, points: number) => {
        if (!['Fácil', 'Moderado', 'Difícil'].includes(difficulty)) {
            throw new QuestionValidationError('La dificultad debe ser "Fácil", "Moderado" o "Difícil"', questionData)
        }

        if (difficulty === 'Fácil' && points != 10) {
            throw new QuestionValidationError('La dificultad "Fácil" debe otorgar 10 puntos', questionData)
        }

        if (difficulty === 'Moderado' && points != 15) {
            throw new QuestionValidationError('La dificultad "Moderado" debe otorgar 15 puntos', questionData)
        }

        if (difficulty === 'Difícil' && points != 20) {
            throw new QuestionValidationError('La dificultad "Difícil" debe otorgar 20 puntos', questionData)
        }
    }

    const validateCategory = (category: string) => {
        let matchs = 0
        categories.map((c) => {
            if(c === category) {
                matchs += 1
            }
        })
        if(matchs === 0) {
            throw new QuestionValidationError(`La categoría debe ser una de las siguientes: ${categories}`, questionData)
        }
    }

    validateQuestionText(questionData.question)
    validateCorrectAnswer(questionData.correctAnswer)
    validateOptions(questionData.options)
    validateDifficulty(questionData.difficulty, questionData.points)
    validateCategory(questionData.category)  
}