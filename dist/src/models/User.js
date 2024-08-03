"use strict";
/**
 * User Model
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const definitions_1 = require("../definitions");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            isUUID: 4
        }
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: 3
        }
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: definitions_1.USER_DEFAULT_AVATAR
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 8
        }
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    activeQuestion: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    totalQuestions: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    successResponses: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'users',
    sequelize: db_1.default,
    hooks: {
        beforeSave: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.changed('password')) {
                user.password = yield bcrypt_1.default.hash(user.password, 10);
            }
        })
    }
});
User.prototype.verifyPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = User;
