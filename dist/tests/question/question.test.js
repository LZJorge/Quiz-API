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
describe('Questions tests:', () => {
    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie;
    /**
     * Stores & points the correct answer of the question
     * This is used to test answering a question
     */
    let correctAnswer;
    let points;
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
    const updateCookie = () => it('should update session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
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
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toMatch(/^connect.sid=/);
        });
        cookie = response.headers['set-cookie'];
    }));
    /**
     * Get random question
     * @url '/question'
     * @method GET
     */
    describe('Getting random question:', () => {
        updateCookie();
        it('will not return question if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('Should return random question', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => __awaiter(void 0, void 0, void 0, function* () {
                expect(response.body).toMatchObject({
                    id: expect.any(Number),
                    question: expect.any(String),
                    correctAnswer: expect.any(String),
                    options: expect.any(Array),
                    points: expect.any(Number),
                    difficulty: expect.stringMatching(/^(Fácil|Moderado|Difícil)$/)
                });
                const user = yield User_1.default.findOne({
                    where: {
                        username: setup_1.testUser.username
                    }
                });
                expect(user).toBeTruthy();
                expect(user === null || user === void 0 ? void 0 : user.totalQuestions).toBe(1);
                expect(user === null || user === void 0 ? void 0 : user.activeQuestion).toBe(response.body.id);
            }));
        }));
    });
    /**
     * Send answer to active question
     * @url '/question'
     * @method POST
     * @method PUT
     * @method PATCH
     */
    describe('Sending answers:', () => {
        it('will not return response if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .put('/question')
                .set('Accept', 'application/json')
                .send({
                answer: 'correctAnswer'
            })
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        describe('Sending incorrect answer:', () => {
            updateCookie();
            it('Should send incorrect answer', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setup_1.request
                    .put('/question')
                    .set('Accept', 'application/json')
                    .set('Cookie', cookie)
                    .send({
                    answer: 'I\'m  a random response text'
                })
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
                    .expect((response) => __awaiter(void 0, void 0, void 0, function* () {
                    expect(response.body.code).toBe('fail');
                    const user = yield User_1.default.findOne({
                        where: {
                            username: setup_1.testUser.username
                        }
                    });
                    expect(user).toBeTruthy();
                    expect(user === null || user === void 0 ? void 0 : user.score).toBe(0);
                    expect(user === null || user === void 0 ? void 0 : user.activeQuestion).toBe(0);
                }));
            }));
        });
        describe('Sending correct answer:', () => {
            updateCookie();
            it('should get new question', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield setup_1.request
                    .get('/question')
                    .set('Cookie', cookie)
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
                correctAnswer = response.body.correctAnswer;
                points = response.body.points;
            }));
            updateCookie();
            it('Should send correct answer', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setup_1.request
                    .put('/question')
                    .set('Accept', 'application/json')
                    .set('Cookie', cookie)
                    .send({
                    answer: correctAnswer
                })
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
                    .expect((response) => __awaiter(void 0, void 0, void 0, function* () {
                    expect(response.body.code).toBe('success');
                    const user = yield User_1.default.findOne({
                        where: {
                            username: setup_1.testUser.username
                        }
                    });
                    expect(user).toBeTruthy();
                    expect(user === null || user === void 0 ? void 0 : user.score).toBe(points);
                    expect(user === null || user === void 0 ? void 0 : user.activeQuestion).toBe(0);
                }));
            }));
        });
    });
    /**
     * Get random question by especific category
     * @url '/question/:category'
     * @method GET
     */
    describe('Getting random question of especific category:', () => {
        let previousQuestion;
        updateCookie();
        it('will not return question if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question/Deportes')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('will not return random question if category don\'t exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question/unexistent-category')
                .set('Cookie', cookie)
                .expect(400)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body).toMatchObject({
                    code: 'error',
                    message: 'No existe esa categoría'
                });
            });
        }));
        it('Should return random question by especific category', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield setup_1.request
                .get('/question/deportes')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body).toMatchObject({
                    id: expect.any(Number),
                    question: expect.any(String),
                    correctAnswer: expect.any(String),
                    options: expect.any(Array),
                    points: expect.any(Number),
                    difficulty: expect.stringMatching(/^(Fácil|Moderado|Difícil)$/),
                    Category: {
                        name: expect.stringMatching(/Deportes/)
                    }
                });
            });
            previousQuestion = response.body;
        }));
        updateCookie();
        it('Should return same question if has active question of same especific category', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question/deportes')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body).toMatchObject(previousQuestion);
            });
        }));
        it('Should return same question if has active question and category param is not normalized ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/question/dEpÓrtEs')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body).toMatchObject(previousQuestion);
            });
        }));
    });
});
