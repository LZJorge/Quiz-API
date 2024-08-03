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
const setup_1 = require("../setup");
const User_1 = __importDefault(require("../../src/models/User"));
describe('Authentication tests:', () => {
    /**
     * token is used for persisting session between request
     */
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.create({
            username: setup_1.testUser.username,
            password: setup_1.testUser.password
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.destroy({
            where: {}, truncate: true
        });
    }));
    /**
     * Authenticate user
     * @url '/auth/login'
     * @method POST
     */
    describe('Authenticating an user', () => {
        it('should not signin invalid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({
                username: setup_1.testUser.username,
                password: setup_1.testUser.wrongPassword
            })
                .expect(401)
                .expect('Content-Type', /application\/json/);
        }));
        it('should signin valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield setup_1.request
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({
                username: setup_1.testUser.username,
                password: setup_1.testUser.password
            })
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body.token).toBeDefined();
            });
            token = response.headers['set-token'];
        }));
    });
    /**
     * Logout an user
     * @url '/user/logout'
     * @method GET
     */
    describe('Logout an user', () => {
        it('should logout user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/user/logout')
                .set('token', token)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
        it('will not logout if don\'t send session token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/user/logout')
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
    });
});
