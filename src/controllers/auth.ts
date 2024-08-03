/**
 * Authentication Controller
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import { Request, Response, NextFunction } from 'express'
import passport from '../config/passport'
import jwt from 'jsonwebtoken'
import userService from '../services/userService'
import { RESPONSE_CODE } from '../definitions'
import { compare } from 'bcrypt'
import User from '../models/User'
import { config } from "dotenv";

config();

class AuthController {

    /**
     * Login
     * @url '/auth/login'
     * @method POST
     */
    public static async authenticateUser (req: Request, res: Response): Promise<Response> {
        try {
            const { username, password } = req.body;
            const user = await userService.getUserByUsername(username);

            if (!user) {
                return res.status(401).json({
                  code: RESPONSE_CODE.ERROR,
                  message: "Usuario o contraseña incorrectos",
                });
            }

            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({
                  code: RESPONSE_CODE.ERROR,
                  message: "Usuario o contraseña incorrectos",
                });
            }

            const token = jwt.sign(
              {
                id: user.id,
                username: user.username,
              },
              `${process.env.SECRET_KEY}`,
              {
                expiresIn: "24h",
                algorithm: "HS256",
              }
            );
            
            return res.status(200).json({
              code: RESPONSE_CODE.SUCCESS,
              message: "Se ha iniciado la sesión",
              token
            });
        } catch (error) {
            console.log(error);
            return res
              .status(500)
              .json({ code: RESPONSE_CODE.ERROR, message: "Error al iniciar la sesión", error });
        }
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
        passport.authenticate('jwt', { session: false },  (err: any, user: typeof User) => {
            if (err) {
                return res.status(401).json({
                    code: RESPONSE_CODE.ERROR,
                    message: 'Token no valido'
                })
            }
            if (!user) {
                return res.status(401).json({
                    code: RESPONSE_CODE.ERROR,
                    message: 'No hay token'
                })
            }

            req.user = user

            return next();
        })(req, res, next)
    }
}

export default AuthController
