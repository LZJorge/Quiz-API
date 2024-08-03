"use strict";
/**
 * User services
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
const definitions_1 = require("../definitions");
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = __importDefault(require("sequelize"));
class UserService {
    /**
     * @description
     *
     * Inserts user into database
     */
    createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = User_1.default.build({
                    username,
                    password,
                });
                yield user.save();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /**
     * @description
     *
     * Gets user by his username
     * This is used to log in users
     */
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findByPk(id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                return user;
            }
            catch (error) {
                return undefined;
            }
        });
    }
    /**
     * @description
     *
     * Gets user by his username
     * This is used to log in users
     */
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({
                    where: {
                        username: username,
                    },
                });
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                return user;
            }
            catch (error) {
                return undefined;
            }
        });
    }
    /**
     * @description
     *
     * Updates user password
     */
    updateUserPassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByPk(id);
            if (!user) {
                throw new Error("Ha ocurrido un error al actualizar la contraseña");
            }
            yield user.update({
                password: newPassword,
            });
            return true;
        });
    }
    /**
     * @description
     *
     * Updates user avatar
     */
    updateUserAvatar(id, newAvatar) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByPk(id);
            if (!user) {
                throw new Error("Ha ocurrido un error al actualizar el avatar");
            }
            yield user.update({
                avatar: newAvatar,
            });
            return true;
        });
    }
    /**
     * @description
     *
     * Get users leaderboard sorted by highest score
     */
    getLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leaderboard = yield User_1.default.findAll({
                    order: [["score", "DESC"]],
                    limit: definitions_1.LEADERBOARD_SIZE,
                    attributes: definitions_1.LEADERBOARD_USER_ATTRIBUTES,
                });
                if (!leaderboard) {
                    throw new Error("No se puedo obtener la tabla");
                }
                return leaderboard;
            }
            catch (error) {
                return undefined;
            }
        });
    }
    /**
     * @description
     *
     * Updates user score
     * Used when question is answered
     */
    updateScore(userId, success, points) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const updatedScore = success
                ? user.score + points
                : Math.max(user.score - 10, 0);
            const updatedSuccessResponses = success
                ? user.successResponses + 1
                : user.successResponses;
            yield User_1.default.update({
                successResponses: updatedSuccessResponses,
                activeQuestion: 0,
                score: updatedScore,
            }, {
                where: {
                    id: userId,
                },
            });
            return {
                updatedScore,
                updatedSuccessResponses,
            };
        });
    }
    /**
     * @description
     *
     * Updates active question
     * Used when user gets new question
     * It prevents some minor abuses
     */
    updateActiveQuestion(userId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findByPk(userId);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                yield user.update({
                    activeQuestion: questionId,
                    totalQuestions: sequelize_1.default.literal("totalQuestions + 1"),
                });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    /**
     * @description
     *
     * Deletes user from database
     */
    deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUsers = yield User_1.default.destroy({
                    where: {
                        id: userID,
                    },
                });
                if (deletedUsers === 0) {
                    throw new Error("No se pudo eliminar al usuario");
                }
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.default = new UserService();
