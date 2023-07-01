/**
 * Question Validator
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { IQuestion } from '../definitions'

export class QuestionValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'Question Validation Error'
    }
}

export const validateQuestion = (questionData: IQuestion) => {

    const validateQuestionText = (questionText: string) => {
        if (!questionText || questionText.trim() === '') {
            throw new QuestionValidationError('La pregunta es requerida')
        }
    }

    const validateCorrectAnswer = (correctAnswer: string) => {
        if (!correctAnswer || correctAnswer.trim() === '') {
            throw new QuestionValidationError('La respuesta correcta es requerida')
        }
    }

    const validateOptions = (options: string[]) => {
        if (!Array.isArray(options) || options.length !== 4) {
            throw new QuestionValidationError('Las opciones deben ser un array de 4 cadenas')
        } else {
        }
    }

    const validatePoints = (points: number) => {
        if (!Number.isInteger(points) || points < 10 || points > 20) {
            throw new QuestionValidationError('La puntuacion debe ser de 10, 15 o 20')
        }
    }

    const validateDifficulty = (difficulty: string) => {
        if (!['Fácil', 'Moderado', 'Difícil'].includes(difficulty)) {
            throw new QuestionValidationError('La dificultad debe ser "Fácil", "Moderado" o "Difícil"')
        }
    }

    validateQuestionText(questionData.question)
    validateCorrectAnswer(questionData.correctAnswer)
    validateOptions(questionData.options)
    validatePoints(questionData.points)
    validateDifficulty(questionData.difficulty)  
}