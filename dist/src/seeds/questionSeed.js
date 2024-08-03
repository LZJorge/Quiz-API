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
exports.loadQuestionData = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const sportsData_json_1 = __importDefault(require("../data/sportsData.json"));
const musicData_json_1 = __importDefault(require("../data/musicData.json"));
const artData_json_1 = __importDefault(require("../data/artData.json"));
const historyData_json_1 = __importDefault(require("../data/historyData.json"));
const programmingData_json_1 = __importDefault(require("../data/programmingData.json"));
const questionValidator_1 = require("../validators/questionValidator");
const Category_1 = __importDefault(require("../models/Category"));
function validateData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const questionData of data) {
            (0, questionValidator_1.validateQuestion)(questionData);
        }
    });
}
function loadData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const questionData of data) {
                const { question, correctAnswer, options, points, difficulty, category } = questionData;
                const categoryData = yield Category_1.default.findOne({
                    where: {
                        name: category
                    }
                });
                const questionRecord = Question_1.default.build({
                    question,
                    correctAnswer,
                    options,
                    points,
                    difficulty,
                    categoryId: categoryData === null || categoryData === void 0 ? void 0 : categoryData.id
                });
                yield questionRecord.save();
            }
        }
        catch (error) {
            if (error instanceof questionValidator_1.QuestionValidationError) {
                throw new questionValidator_1.QuestionValidationError(error.message, error.question);
            }
        }
    });
}
function loadQuestionData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all([
                validateData(sportsData_json_1.default),
                validateData(musicData_json_1.default),
                validateData(historyData_json_1.default),
                validateData(artData_json_1.default),
                validateData(programmingData_json_1.default)
            ]);
            console.log('All questions verified ✅');
            yield Promise.all([
                loadData(sportsData_json_1.default),
                loadData(musicData_json_1.default),
                loadData(historyData_json_1.default),
                loadData(artData_json_1.default),
                loadData(programmingData_json_1.default)
            ]);
            console.log('Questions loaded successfully ✅');
        }
        catch (error) {
            if (error instanceof questionValidator_1.QuestionValidationError) {
                console.log('❌', error.name, '❌');
                console.log(error.message, '\n');
                console.log(error.question);
                yield Promise.all([
                    Question_1.default.destroy({
                        where: {}, truncate: true
                    }),
                    Category_1.default.destroy({
                        where: {}, truncate: true
                    })
                ]);
                console.log('❗Questions not loaded, close server, fix data and try again');
            }
        }
    });
}
exports.loadQuestionData = loadQuestionData;
