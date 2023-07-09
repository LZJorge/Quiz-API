/**
 * Sessions
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import passport from 'passport'
import User from '../models/User'
import { Strategy as LocalStrategy } from 'passport-local'
import { IUser } from '../definitions'

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },

        async (username: string, password: string, done) => {
            try {
                const user = await User.findOne({
                    where: { 
                        username: username 
                    }
                })

                if(!user) {
                    return done(null, false, {
                        message: 'El usuario no existe'
                    })
                }

                const match = await user.verifyPassword(password)
                if(!match) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    })
                }

                return done(null, user, {
                    message: '¡Logueado correctamente!'
                })

            } catch(error) {
                return done(null, false, {
                    message: 'Ha ocurrido un error'
                })
            }
        }
    )
)

passport.serializeUser((user: User | any, callback) => {
    callback(null, user.id)
})

passport.deserializeUser( async (id: string, callback) => {
    try {
        const user = await User.findByPk(id);
        callback(null, user);
    } catch (error) {
        callback(error);
    }
})

export default passport