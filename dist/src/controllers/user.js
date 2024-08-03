"use strict";
/**
 * Users Controller
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
const userService_1 = __importDefault(require("../services/userService"));
const definitions_1 = require("../definitions");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const userService_2 = __importDefault(require("../services/userService"));
class UserController {
    /**
     * Create User
     * @url '/user/create'
     * @method POST
     */
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                yield userService_1.default.createUser(username, password);
                res.status(200).json({
                    code: definitions_1.RESPONSE_CODE.SUCCESS,
                    message: 'Usuario creado satisfactoriamente'
                });
            }
            catch (error) {
                res.status(400).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: error.message
                });
            }
        });
    }
    /**
     * Updates User Password
     * @url '/user/update/password'
     * @method PUT
     * @method PATCH
     */
    static updateUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword } = req.body;
            const { id } = req.user;
            try {
                yield userService_1.default.updateUserPassword(id, newPassword);
                res.status(200).json({
                    code: 'success',
                    message: 'Contraseña actualizada'
                });
            }
            catch (error) {
                res.status(500).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: error.message
                });
            }
        });
    }
    /**
     * Update User Avatar
     * @url '/user/update/avatar'
     * @method PUT
     * @method PATCH
     */
    static updateUserAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newAvatar } = req.body;
            const { id } = req.user;
            try {
                yield userService_1.default.updateUserAvatar(id, newAvatar);
                res.status(200).json({
                    code: definitions_1.RESPONSE_CODE.SUCCESS,
                    message: 'Se actualizó el avatar'
                });
            }
            catch (error) {
                res.status(500).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: error.message
                });
            }
        });
    }
    /**
     * Delete User
     * @url '/user/delete'
     * @method DELETE
     */
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.body;
            const { id } = req.user;
            try {
                if (id && id === userID) {
                    yield userService_1.default.deleteUser;
                    req.session.destroy(() => {
                        res.status(200).json({
                            code: definitions_1.RESPONSE_CODE.SUCCESS,
                            message: 'El usuario ha sido eliminado'
                        });
                    });
                }
                else {
                    res.status(403).json({
                        code: definitions_1.RESPONSE_CODE.ERROR,
                        message: 'No tienes permiso para eliminar este usuario'
                    });
                }
            }
            catch (error) {
                res.status(404).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'No tienes permiso para eliminar este usuario'
                });
            }
        });
    }
    /**
     * Get current user
     * @url '/user/current'
     * @method GET
     */
    static getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_2.default.getUser(req.user.id);
                if (!user) {
                    res.status(400).json({
                        code: definitions_1.RESPONSE_CODE.ERROR,
                        message: "Error al obtener el usuario",
                    });
                    return;
                }
                res.status(200).json({
                    code: 'success',
                    user: user
                });
            }
            catch (err) {
                res.status(500).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'Ha ocurrido un error'
                });
            }
        });
    }
    /**
     * Get User Leaderboard *10 highest score*
     * @url '/user/getLeaderboard'
     * @method GET
     */
    static getLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leaderboard = yield userService_1.default.getLeaderboard();
                res.status(200).json(leaderboard);
            }
            catch (error) {
                res.status(422).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: error.message
                });
            }
        });
    }
    /**
     * Get User Avatars
     * @url '/avatars/get'
     * @method GET
     */
    static getAvatars(req, res) {
        const avatarsDir = path_1.default.join(__dirname, '../../../public', 'avatars');
        fs_1.default.readdir(avatarsDir, (err, files) => {
            if (err) {
                res.status(500).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'Error al leer la carpeta de avatares'
                });
                return;
            }
            const avatars = files.map((file) => `/avatars/${file}`);
            res.status(200).json({
                code: definitions_1.RESPONSE_CODE.SUCCESS,
                avatars
            });
        });
    }
}
exports.default = UserController;
