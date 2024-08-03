"use strict";
/**
 * Express Router
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const question_1 = __importDefault(require("../controllers/question"));
const auth_1 = __importDefault(require("../controllers/auth"));
const category_1 = __importDefault(require("../controllers/category"));
const userValidator_1 = require("../validators/userValidator");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
        this.setUserRoutes();
        this.setQuestionRoutes();
        this.setCategoriesRoutes();
    }
    setUserRoutes() {
        this.router.post('/auth/login', auth_1.default.authenticateUser);
        this.router.post('/user/create', userValidator_1.validateCreateUser, user_1.default.createUser);
        this.router.route('/user/update/password')
            .put(auth_1.default.isAuthenticated, userValidator_1.validateUpdateUserPassword, user_1.default.updateUserPassword)
            .patch(auth_1.default.isAuthenticated, userValidator_1.validateUpdateUserPassword, user_1.default.updateUserPassword);
        this.router.route('/user/update/avatar')
            .put(auth_1.default.isAuthenticated, userValidator_1.validateUserAvatar, user_1.default.updateUserAvatar)
            .patch(auth_1.default.isAuthenticated, userValidator_1.validateUserAvatar, user_1.default.updateUserAvatar);
        this.router.delete('/user/delete', auth_1.default.isAuthenticated, userValidator_1.validateDeleteUser, user_1.default.deleteUser);
        this.router.get('/user/current', auth_1.default.isAuthenticated, user_1.default.getCurrentUser);
        this.router.get('/user/getLeaderboard', auth_1.default.isAuthenticated, user_1.default.getLeaderboard);
        this.router.get('/user/logout', auth_1.default.isAuthenticated, auth_1.default.logout);
        this.router.get('/avatars/get', auth_1.default.isAuthenticated, user_1.default.getAvatars);
    }
    setQuestionRoutes() {
        this.router.route('/question')
            .get(auth_1.default.isAuthenticated, question_1.default.getRandomQuestion)
            .patch(auth_1.default.isAuthenticated, question_1.default.sendAnswer)
            .post(auth_1.default.isAuthenticated, question_1.default.sendAnswer)
            .put(auth_1.default.isAuthenticated, question_1.default.sendAnswer);
        this.router.get('/question/:category', auth_1.default.isAuthenticated, question_1.default.getQuestionByCategory);
    }
    setCategoriesRoutes() {
        this.router.get('/category/get', auth_1.default.isAuthenticated, category_1.default.getCategories);
    }
    getRoutes() {
        return this.router;
    }
}
exports.default = Router;
