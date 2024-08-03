"use strict";
/**
 * Authentication Controller
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
const passport_1 = __importDefault(require("../config/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../services/userService"));
const definitions_1 = require("../definitions");
const bcrypt_1 = require("bcrypt");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class AuthController {
    /**
     * Login
     * @url '/auth/login'
     * @method POST
     */
    static authenticateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield userService_1.default.getUserByUsername(username);
                if (!user) {
                    return res.status(401).json({
                        code: definitions_1.RESPONSE_CODE.ERROR,
                        message: "Usuario o contraseña incorrectos",
                    });
                }
                const passwordMatch = yield (0, bcrypt_1.compare)(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({
                        code: definitions_1.RESPONSE_CODE.ERROR,
                        message: "Usuario o contraseña incorrectos",
                    });
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    username: user.username,
                }, `${process.env.SECRET_KEY}`, {
                    expiresIn: "24h",
                    algorithm: "HS256",
                });
                return res.status(200).json({
                    code: definitions_1.RESPONSE_CODE.SUCCESS,
                    message: "Se ha iniciado la sesión",
                    token
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ code: definitions_1.RESPONSE_CODE.ERROR, message: "Error al iniciar la sesión", error });
            }
        });
    }
    /**
     * Logout
     * @url '/user/logout'
     * @method POST
     */
    static logout(req, res) {
        if (req.session) {
            req.session.destroy(() => {
                res.status(200).send({
                    code: definitions_1.RESPONSE_CODE.SUCCESS,
                    message: 'Se cerró la sesión'
                });
            });
        }
        else {
            res.status(400).json({
                code: definitions_1.RESPONSE_CODE.ERROR,
                message: 'No hay ninguna sesión activa'
            });
        }
    }
    /**
     * Verify user is authenticated
     * @url Any url
     * @method any
     */
    static isAuthenticated(req, res, next) {
        passport_1.default.authenticate('jwt', { session: false }, (err, user) => {
            if (err) {
                return res.status(401).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'Token no valido'
                });
            }
            if (!user) {
                return res.status(401).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'No hay token'
                });
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
}
exports.default = AuthController;
