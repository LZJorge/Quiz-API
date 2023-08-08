/**
 * Authentication Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request, Response, NextFunction } from 'express'
import passport from '../config/passport'
import User from '../models/User'
import { RESPONSE_CODE } from '../definitions'

class AuthController {

    /**
     * Login
     * @url '/auth/login'
     * @method POST
     */
    public static authenticateUser (req: Request, res: Response): void {
        passport.authenticate('local', (err: Error, user: User, info: object): void => {
            if (err) {
                res.status(500).json('Ha ocurrido un error')
            } else if (!user) {
                res.status(401).json({
                    code: RESPONSE_CODE.ERROR,
                    message: 'Usuario o contraseña incorrectos'
                })
            } else {
                req.login(user, (err: Error) => {
                    if (err) {
                        res.status(400).json(err)
                    } else {
                        res.status(200).json(info)
                    }
                })
            }
        })(req, res)
    }

    /**
     * Logout
     * @url '/user/logout'
     * @method POST
     */
    public static logout (req: Request, res: Response): void {
        if(req.session) {
            req.session.destroy(()=> {
                res.status(200).send({
                    code: RESPONSE_CODE.SUCCESS,
                    message: 'Se cerró la sesión'
                })
            })
        } else {
            res.status(400).json({
                code: RESPONSE_CODE.ERROR,
                message: 'No hay ninguna sesión activa'
            })
        }
    }

    /**
     * Verify user is authenticated
     * @url Any url
     * @method any
     */
    public static isAuthenticated (req: Request, res: Response, next: NextFunction): void {
        if(req.isAuthenticated()) {
            return next()
        }

        res.status(401).json({
            code: RESPONSE_CODE.ERROR,
            message: 'Tienes que estar autenticado'
        })
    }
}

export default AuthController
