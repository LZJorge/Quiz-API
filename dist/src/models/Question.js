"use strict";
/**
 * Question Model
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
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const questionSeed_1 = require("../seeds/questionSeed");
const Category_1 = __importDefault(require("./Category"));
class Question extends sequelize_1.Model {
}
Question.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    question: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    correctAnswer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    options: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    points: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    difficulty: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'questions',
    sequelize: db_1.default,
    hooks: {
        afterSync: () => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield Question.count();
            if (count === 0) {
                yield (0, questionSeed_1.loadQuestionData)();
            }
        })
    }
});
Question.belongsTo(Category_1.default, {
    foreignKey: 'categoryId',
});
exports.default = Question;
