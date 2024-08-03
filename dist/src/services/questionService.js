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
const Question_1 = __importDefault(require("../models/Question"));
const Category_1 = __importDefault(require("../models/Category"));
const sequelize_1 = __importDefault(require("sequelize"));
const normalizeHelper_1 = require("../helpers/normalizeHelper");
const definitions_1 = require("../definitions");
class QuestionService {
    /**
     * @description
     *
     * By defaults return a random question
     * Can provide a category to return random question filtered by some category
     */
    getRandomQuestion(category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (category) {
                category = (0, normalizeHelper_1.normalizeString)(category);
                const categoryId = yield Category_1.default.findOne({
                    where: {
                        slug: category
                    }
                });
                if (!categoryId) {
                    return null;
                }
                const question = yield Question_1.default.findOne({
                    where: {
                        categoryId: categoryId.id
                    },
                    order: sequelize_1.default.literal('RANDOM()'),
                    attributes: definitions_1.QUESTION_ATTRIBUTES,
                    include: [
                        {
                            model: Category_1.default,
                            attributes: definitions_1.CATEGORY_ATTRIBUTES
                        }
                    ]
                });
                if (!question) {
                    return null;
                }
                return question;
            }
            const question = yield Question_1.default.findOne({
                order: sequelize_1.default.literal('RANDOM()'),
                attributes: definitions_1.QUESTION_ATTRIBUTES,
                include: [
                    {
                        model: Category_1.default,
                        attributes: definitions_1.CATEGORY_ATTRIBUTES
                    }
                ]
            });
            if (!question) {
                return null;
            }
            return question;
        });
    }
    /**
     * @description
     *
     * Returns a question by his id
     */
    getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield Question_1.default.findOne({
                where: {
                    id: questionId
                },
                attributes: definitions_1.QUESTION_ATTRIBUTES,
                include: [
                    {
                        model: Category_1.default,
                        attributes: definitions_1.CATEGORY_ATTRIBUTES
                    }
                ]
            });
            if (!question) {
                return null;
            }
            return question;
        });
    }
}
exports.default = new QuestionService();
