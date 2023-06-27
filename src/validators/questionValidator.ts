/**
 * Question Validator
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { IQuestion } from '../definitions'

export function validateQuestion (questionData: IQuestion) {
    const errors: string[] = []

    const validateQuestionText = (questionText: string) => {
        if (!questionText || questionText.trim() === '') {
            errors.push('La pregunta es requerida')
        }
    }

    const validateCorrectAnswer = (correctAnswer: string) => {
        if (!correctAnswer || correctAnswer.trim() === '') {
            errors.push('La respuesta correcta es requerida')
        }
    }

    const validateOptions = (options: string[]) => {
        if (!Array.isArray(options) || options.length !== 4) {
            errors.push('Las opciones deben ser un array con longitud 4')
        }
    }

    const validatePoints = (points: number) => {
        if (!Number.isInteger(points) || points < 10 || points > 20) {
            errors.push('Los puntos deben ser un número entero entre 10 y 20')
        }
    }

    const validateDifficulty = (difficulty: string) => {
        if (!['Fácil', 'Moderado', 'Difícil'].includes(difficulty)) {
            errors.push('La dificultad debe ser "Fácil", "Moderado" o "Difícil"')
        }
    }

    validateQuestionText(questionData.question)
    validateCorrectAnswer(questionData.correctAnswer)
    validateOptions(questionData.options)
    validatePoints(questionData.points)
    validateDifficulty(questionData.difficulty)
  
    return errors
}