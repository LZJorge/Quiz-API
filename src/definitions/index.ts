/**
 * Types Definitions
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request } from 'express'
import Question from '../models/Question'

export type difficulty = 'Fácil' | 'Moderado' | 'Difícil'

export interface IUser {
    id: string
    username: string
    avatar: string
    password: string
    score: number
    activeQuestion: number
    totalQuestions: number
    successResponses: number

    verifyPassword: (password: string) => Promise<boolean>

    createdAt: Date
    updatedAt: Date
}

export interface IUserRequest extends Request {
    user?: IUser | any
}

export interface IQuestion {
    question: string
    correctAnswer: string
    options: string[]
    points: number
    difficulty: string
    category: string
}

export interface IQuestionWithCategory extends Question {
    Category?: {
        name: string
        imgUrl: string
    }
}