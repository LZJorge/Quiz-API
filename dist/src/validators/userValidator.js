"use strict";
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
exports.validateDeleteUser = exports.validateUserAvatar = exports.validateUpdateUserPassword = exports.validateCreateUser = void 0;
const express_validator_1 = require("express-validator");
const validatorsHelper_1 = __importDefault(require("../helpers/validatorsHelper"));
const User_1 = __importDefault(require("../models/User"));
const sanitizeString = (value) => {
    if (value.trim()[0] == '') {
        throw new Error('Los campos no pueden comenzar con un caracter en blanco');
    }
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(value)) {
        throw new Error('Los campos no pueden contener caracteres especiales');
    }
    return value.trim();
};
exports.validateCreateUser = [
    (0, express_validator_1.body)('username')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio')
        .isString()
        .isLength({ min: 3 })
        .withMessage('El usuario debe tener mínimo 3 caracteres')
        .custom(sanitizeString)
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const userExists = yield User_1.default.findOne({
            where: {
                username: value
            }
        });
        if (userExists) {
            throw new Error('El nombre de usuario ya se encuentra en uso');
        }
        return true;
    })),
    (0, express_validator_1.body)('password')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),
    (0, express_validator_1.body)('passwordConfirm')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La confirmación de contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La confirmación de contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),
    (0, express_validator_1.body)('passwordConfirm')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    })
        .withMessage('Las contraseñas no coinciden'),
    (req, res, next) => {
        (0, validatorsHelper_1.default)(req, res, next);
    }
];
exports.validateUpdateUserPassword = [
    (0, express_validator_1.body)('password')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),
    (0, express_validator_1.body)('newPassword')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La nueva contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),
    (0, express_validator_1.body)('newPasswordConfirm')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La confirmación de contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La confirmación de contraseña debe tener mínimo 8 caracteres')
        .custom(sanitizeString),
    (0, express_validator_1.body)('newPasswordConfirm')
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    })
        .withMessage('Las contraseñas no coinciden'),
    (0, express_validator_1.body)('password')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const match = yield req.user.verifyPassword(value);
        if (!match) {
            throw new Error('Las contraseña actual es incorrecta');
        }
        return true;
    })),
    (req, res, next) => {
        (0, validatorsHelper_1.default)(req, res, next);
    }
];
/**
 * Regex for user avatar validate
 * user avatar route:
 * 'avatars/avatar-xx.svg'
 */
const avatarRegex = /^\/avatars\/avatar-\d{2}\.svg$/;
exports.validateUserAvatar = [
    (0, express_validator_1.body)('newAvatar')
        .trim()
        .exists()
        .notEmpty()
        .isString()
        .matches(avatarRegex)
        .withMessage('Se introdujo un avatar inválido'),
    (req, res, next) => {
        (0, validatorsHelper_1.default)(req, res, next);
    }
];
exports.validateDeleteUser = [
    (0, express_validator_1.body)('password')
        .trim()
        .exists()
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isString()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres'),
    (0, express_validator_1.body)('userID')
        .trim()
        .exists()
        .notEmpty()
        .isString()
        .isUUID()
        .withMessage('El ID del usuario es obligatorio'),
    (0, express_validator_1.body)('password')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const match = yield req.user.verifyPassword(value);
        if (!match) {
            throw new Error('Las contraseña es incorrecta');
        }
        return true;
    })),
    (req, res, next) => {
        (0, validatorsHelper_1.default)(req, res, next);
    }
];
