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
const categorySeed_1 = require("../../src/seeds/categorySeed");
describe('Categories tests:', () => {
    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie;
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
    describe('Getting list of all categories:', () => {
        it('should get session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
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
        it('will not get list of available categories if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/category/get')
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('should return list of available categories', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/category/get')
                .set('Accept', 'application/json')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => __awaiter(void 0, void 0, void 0, function* () {
                categorySeed_1.categories.map((category, key) => {
                    expect(response.body.categories[key].name).toBe(category);
                    expect(response.body.categories[key].slug).toBe(category
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, '-')
                        .trim());
                    expect(response.body.categories[key].imgUrl).toBe(`/categories/${response.body.categories[key].slug}.svg`);
                });
            }));
        }));
    });
});
