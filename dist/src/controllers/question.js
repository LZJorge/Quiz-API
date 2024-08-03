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
const userService_1 = __importDefault(require("../services/userService"));
const questionService_1 = __importDefault(require("../services/questionService"));
const definitions_1 = require("../definitions");
const normalizeHelper_1 = require("../helpers/normalizeHelper");
class QuestionController {
    /**
     * Get Random Question
     * @url '/question'
     * @method GET
     */
    static getRandomQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Active question != 0 means user has active question
             * So return the same question
             */
            if (req.user.activeQuestion != 0) {
                const question = yield questionService_1.default.getQuestionById(req.user.activeQuestion);
                res.status(200).json(question);
            }
            else {
                const question = yield questionService_1.default.getRandomQuestion();
                if (question) {
                    yield userService_1.default.updateActiveQuestion(req.user.id, question.id);
                    req.user.activeQuestion = question.id;
                    req.user.totalQuestions = req.user.totalQuestions + 1;
                    req.login(req.user, (error) => {
                        if (error) {
                            next(error);
                        }
                        else {
                            res.status(200).json(question);
                        }
                    });
                }
            }
        });
    }
    /**
     * Get Random Question by category
     * @url '/question/:category'
     * @method GET
     */
    static getQuestionByCategory(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * If active questions has same category of category params returns same question
             */
            if (req.user.activeQuestion != 0) {
                const question = yield questionService_1.default.getQuestionById(req.user.activeQuestion);
                const category = (0, normalizeHelper_1.normalizeString)(req.params.category);
                if (question && ((_a = question.Category) === null || _a === void 0 ? void 0 : _a.slug) == category) {
                    res.status(200).json(question);
                    return;
                }
            }
            /**
             * Continue ands return random question by the category
             */
            const question = yield questionService_1.default.getRandomQuestion(req.params.category);
            if (!question) {
                res.status(400).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'No existe esa categoría'
                });
                return;
            }
            yield userService_1.default.updateActiveQuestion(req.user.id, question.id);
            req.user.activeQuestion = question.id;
            req.user.totalQuestions = req.user.totalQuestions + 1;
            req.login(req.user, (error) => {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).json(question);
                }
            });
        });
    }
    /**
     * Send Answer
     * @url '/question'
     * @method POST
     * @method PUT
     * @method PATCH
     */
    static sendAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { answer } = req.body;
            if (req.user.activeQuestion == 0) {
                res.status(400).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'No tienes ninguna pregunta activa'
                });
                return;
            }
            const question = yield questionService_1.default.getQuestionById(req.user.activeQuestion);
            if (!question) {
                res.status(500).send({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'No se encontró la pregunta'
                });
                return;
            }
            req.user.activeQuestion = 0;
            const success = answer === question.correctAnswer;
            const { updatedScore, updatedSuccessResponses } = yield userService_1.default.updateScore(req.user.id, success, question.points);
            req.user.score = updatedScore;
            req.user.successResponses = updatedSuccessResponses;
            req.login(req.user, (error) => {
                if (error) {
                    return next(error);
                }
                if (success) {
                    res.status(200).send({
                        code: definitions_1.QUESTION_CODE.SUCCESS,
                        message: `¡Respuesta correcta! +${question.points} puntos 😃`
                    });
                }
                else {
                    res.status(200).send({
                        code: definitions_1.QUESTION_CODE.FAILED,
                        message: 'Respuesta incorrecta. -10 puntos ☹️'
                    });
                }
            });
        });
    }
}
exports.default = QuestionController;
