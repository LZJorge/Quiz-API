import { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import handleValidationErrors from '../helpers/validatorsHelper'

export const validateCreateUser = [
	body('username')
        .exists()
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio')
        .isString()
        .isLength({ min: 3 })
        .withMessage('El usuario debe tener mínimo 3 caracteres'),

	body('password')
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),

	body('passwordConfirm')
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),

	body('passwordConfirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        })
        .withMessage('Las contraseñas no coinciden'),

    (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res, next)
    }
]

export const validateDeleteUser = [
    body('userID')
        .exists()
        .notEmpty()
        .isString()
        .isUUID()
        .withMessage('El ID del usuario es obligatorio'),

    (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res, next)
    }
]