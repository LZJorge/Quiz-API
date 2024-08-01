/**
 * Sessions
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */

import passport from 'passport'
import User from '../models/User'
import { ExtractJwt, Strategy } from "passport-jwt";
import { Algorithm } from 'jsonwebtoken';
import { config } from "dotenv";

config();

if(!process.env.SECRET_KEY) {
  console.log(process.env.SECRET_KEY);
  throw new Error('Falta la variable de entorno SECRET_KEY')
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
  algorithms: ["HS256"] as Algorithm[],
  ignoreExpiration: false,
};

passport.use(
  new Strategy(opts,

    async (payload: { id: string }, done) => {
      try {
        const user = await User.findByPk(payload.id);

        if (!user) {
          return done(null, false, {
            message: "Usuario no encontrado",
          });
        }

        return done(null, user, {
          message: "¡Logueado correctamente!",
        });
      } catch (error) {
        return done(null, false, {
          message: "Ha ocurrido un error",
        });
      }
    }
  )
);

passport.serializeUser((user: User | any, callback) => {
    callback(null, user.id)
})

passport.deserializeUser( async (id: string, callback) => {
    try {
        const user = await User.findByPk(id)
        callback(null, user)
    } catch (error) {
        callback(error)
    }
})

export default passport