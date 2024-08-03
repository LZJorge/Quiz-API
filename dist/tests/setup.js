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
exports.expectValidationError = exports.expectAuthenticationError = exports.testUser = exports.request = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = __importDefault(require("../src/config/db"));
const app = new app_1.default();
exports.request = (0, supertest_1.default)(app.getApp());
exports.testUser = {
    username: 'testuser',
    password: 'testpassword',
    wrongPassword: 'wrong-test-pass',
    updatedPassword: '0123456789',
    updatedAvatar: '/avatars/avatar-05.svg',
    invalidAvatar: '/invalid/avatar-019.svg'
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.startServer();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.stopServer();
    yield db_1.default.close();
}));
const expectAuthenticationError = (response) => {
    expect(response.body).toMatchObject({
        code: 'error',
        message: 'Tienes que estar autenticado'
    });
};
exports.expectAuthenticationError = expectAuthenticationError;
const expectValidationError = (response) => {
    expect(response.body).toMatchObject({
        message: 'Error de validación'
    });
};
exports.expectValidationError = expectValidationError;
