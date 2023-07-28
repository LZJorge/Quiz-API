import { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import handleValidationErrors from '../helpers/validatorsHelper'
import User from '../models/User'

const sanitizeString = (value: string) => {
    if (value.trim()[0] == '') {
        throw new Error('Los campos no pueden comenzar con un caracter en blanco')
    }

    const regex = /^[a-zA-Z0-9]*$/

    if(!regex.test(value)) {
        throw new Error('Los campos no pueden contener caracteres especiales')
    }

    return value.trim()
}

export const validateCreateUser = [
	body('username')
        .exists()
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio')
        .isString()
        .isLength({ min: 3 })
        .withMessage('El usuario debe tener mínimo 3 caracteres')
        .custom(sanitizeString)
        .custom( async (value) => {
            const userExists = await User.findOne({
				where: {
					username: value
				}
			})
	
			if(userExists) {
				throw new Error('El nombre de usuario ya se encuentra en uso')
			}

            return true
        }),

	body('password')
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),

	body('passwordConfirm')
        .exists()
        .notEmpty()
        .withMessage('La confirmación de contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La confirmación de contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),

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

export const validateUpdateUserPassword = [
    body('password')
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),

	body('newPassword')
        .exists()
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La nueva contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),

    body('newPasswordConfirm')
        .exists()
        .notEmpty()
        .withMessage('La confirmación de contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La confirmación de contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),

	body('newPasswordConfirm')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        })
        .withMessage('Las contraseñas no coinciden'),
        
    body('password')
    .custom( async (value, { req }) => {
        const match = await req.user.verifyPassword(value)
        if(!match) {
            throw new Error('Las contraseña actual es incorrecta')
        }

        return true
    }),

    (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res, next)
    }
]

/**
 * Regex for user avatar validate
 * user avatar route:
 * 'avatars/avatar-xx.svg'
 */
const avatarRegex = /^\/avatars\/avatar-\d{2}\.svg$/

export const validateUserAvatar = [
    body('newAvatar')
        .exists()
        .notEmpty()
        .isString()
        .matches(avatarRegex)
        .withMessage('Se introdujo un avatar inválido'),
    
    (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res, next)
    }
]

export const validateDeleteUser = [
    body('password')
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),

    body('userID')
        .exists()
        .notEmpty()
        .isString()
        .isUUID()
        .withMessage('El ID del usuario es obligatorio'),
    
    body('password')
    .custom( async (value, { req }) => {
        const match = await req.user.verifyPassword(value)
        if(!match) {
            throw new Error('Las contraseña es incorrecta')
        }

        return true
    }),

    (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res, next)
    }
]
