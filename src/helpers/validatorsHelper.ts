/**
 * Helpers
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

/**
 * Handles express validator erros
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Error de validación',
            errors: errors.array()
        })
        return
    }

    next()
}

export default handleValidationErrors