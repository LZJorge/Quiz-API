/**
 * Types Definitions & Constants
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request } from 'express'
import Question from '../models/Question'

export const DB_STORAGE = process.env.NODE_ENV === 'test' ? ':memory:' : 'db.sqlite3'

export const USER_DEFAULT_AVATAR = '/avatars/avatar-00.svg'

export const QUESTION_CODE = {
    SUCCESS: 'success',
    FAILED: 'fail'
}

export const RESPONSE_CODE = {
    SUCCESS: 'success',
    ERROR: 'error'
}

export const QUESTION_ATTRIBUTES: string[] = [
    'id', 
    'question', 
    'correctAnswer', 
    'options', 
    'points', 
    'difficulty'
]

export const CATEGORY_ATTRIBUTES: string[] = ['name', 'imgUrl', 'slug']

export const LEADERBOARD_SIZE = 10
export const LEADERBOARD_USER_ATTRIBUTES = [
    'username',
    'avatar',
    'score',
    'successResponses',
    'createdAt'
]

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
        slug: string
    }
}

export interface ICategory {
    id: number
    name: string
    imgUrl: string
    slug: string
}

export interface UpdatedScore {
    updatedScore: number
    updatedSuccessResponses: number
}