"use strict";
/**
 * Sessions
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (!process.env.SECRET_KEY) {
    console.log(process.env.SECRET_KEY);
    throw new Error('Falta la variable de entorno SECRET_KEY');
}
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    ignoreExpiration: false,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByPk(payload.id);
        if (!user) {
            return done(null, false, {
                message: "Usuario no encontrado",
            });
        }
        return done(null, user, {
            message: "¡Logueado correctamente!",
        });
    }
    catch (error) {
        return done(null, false, {
            message: "Ha ocurrido un error",
        });
    }
})));
passport_1.default.serializeUser((user, callback) => {
    callback(null, user.id);
});
passport_1.default.deserializeUser((id, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByPk(id);
        callback(null, user);
    }
    catch (error) {
        callback(error);
    }
}));
exports.default = passport_1.default;
