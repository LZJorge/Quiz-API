"use strict";
/**
 * Types Definitions & Constants
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEADERBOARD_USER_ATTRIBUTES = exports.LEADERBOARD_SIZE = exports.CATEGORY_ATTRIBUTES = exports.QUESTION_ATTRIBUTES = exports.RESPONSE_CODE = exports.QUESTION_CODE = exports.USER_DEFAULT_AVATAR = exports.DB_STORAGE = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DB_STORAGE = process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DB_URL;
exports.USER_DEFAULT_AVATAR = '/avatars/avatar-00.svg';
exports.QUESTION_CODE = {
    SUCCESS: 'success',
    FAILED: 'fail'
};
exports.RESPONSE_CODE = {
    SUCCESS: 'success',
    ERROR: 'error'
};
exports.QUESTION_ATTRIBUTES = [
    'id',
    'question',
    'correctAnswer',
    'options',
    'points',
    'difficulty'
];
exports.CATEGORY_ATTRIBUTES = ['name', 'imgUrl', 'slug'];
exports.LEADERBOARD_SIZE = 10;
exports.LEADERBOARD_USER_ATTRIBUTES = [
    'username',
    'avatar',
    'score',
    'successResponses',
    'createdAt'
];
