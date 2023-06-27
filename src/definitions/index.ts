/**
 * Types Definitions
 * 
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request } from 'express'
import User from '../models/User'

export type difficulty = 'Fácil' | 'Moderado' | 'Difícil'

export interface IUserRequest extends Request {
    user?: User | any
}

export interface IQuestion {
    question: string
    correctAnswer: string
    options: string[]
    points: number
    difficulty: string
}